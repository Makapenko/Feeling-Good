import React from 'react';
import styles from './TodayTasks.module.css';
import {
  useAppDispatch,
  useUnlockedContent,
  useTestsByType,
  useTodayActivitiesProgress
} from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { getAvailableActivities } from '../../data/activitiesMapping';
import { ActivityId, ACTIVITY_IDS } from '../../constants/activities';
import {
  getDaysDifference,
  getCurrentDate
} from '../../utils/dateUtils';
import ReadingHistoryBar from './ReadingHistoryBar';
import ActivityHistoryBar from './ActivityHistoryBar';
import TestTaskComponent from './TestTaskComponent';
import MethodsTaskComponent, { MethodsTask } from './MethodsTaskComponent';
import ReadingTaskComponent from './ReadingTaskComponent';
import FaviritesComponent from './FaviritesComponent';

// Константы для времени в секундах
const READING_GOAL_SECONDS = 300; // 5 минут
const METHODS_GOAL_SECONDS = 900; // 15 минут
const PROCRASTINATION_GOAL_SECONDS = 900; // 15 минут
const BURNS_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями опросника Бернса
const PROCRASTINATION_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями теста на прокрастинацию


// Создадим константы для внутренних идентификаторов
const DAILY_MOOD_ID = 'daily-mood';
const AUTOMATIC_THOUGHTS_ID = 'automatic-thoughts';
const PROCRASTINATION_SCALE_ID = 'procrastination-scale';

const TodayTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();

  const burnsTestResults = useTestsByType(ACTIVITY_IDS.BURNS_CHECKLIST);
  const procrastinationTestResults = useTestsByType(ACTIVITY_IDS.PROCRASTINATION_SCALE);
  const todayActivitiesProgress = useTodayActivitiesProgress();

  // Проверяем статус опросника Бернса
  const checkBurnsStatus = () => {
    const availableActivities = getAvailableActivities(unlockedContent.chapters);
    if (!availableActivities.has(ACTIVITY_IDS.BURNS_CHECKLIST)) return null;

    if (burnsTestResults.length === 0) {
      return {
        id: DAILY_MOOD_ID,
        testId: ACTIVITY_IDS.BURNS_CHECKLIST,
        title: 'Опросник депрессии Бернса',
        message: 'Пройдите опросник депрессии Бернса',
        needToComplete: true,
        lastScore: null,
        scorePercent: null,
        completedAt: null,
        buttonText: 'Открыть опросник'
      };
    }

    const lastCompletionDate = new Date(burnsTestResults[0].completedAt);
    const today = new Date(getCurrentDate());
    const daysSinceLastCompletion = getDaysDifference(today, lastCompletionDate);
    
    // Сохраняем последний результат
    const lastScore = burnsTestResults[0].score ?? null;
    const maxScore = burnsTestResults[0].maxScore || 100;
    const scorePercent = lastScore !== null ? Math.round((lastScore / maxScore) * 100) : null;

    if (daysSinceLastCompletion >= BURNS_TEST_INTERVAL_DAYS) {
      return {
        id: DAILY_MOOD_ID,
        testId: ACTIVITY_IDS.BURNS_CHECKLIST,
        title: 'Опросник депрессии Бернса',
        message: burnsTestResults.length === 1
          ? 'Пройдите опросник Бернса повторно (второй раз)'
          : 'Пройдите опросник Бернса повторно',
        needToComplete: true,
        lastScore,
        scorePercent,
        completedAt: burnsTestResults[0].completedAt,
        buttonText: 'Открыть опросник'
      };
    }

    return {
      id: DAILY_MOOD_ID,
      testId: ACTIVITY_IDS.BURNS_CHECKLIST,
      title: 'Опросник депрессии Бернса',
      message: `Следующее прохождение опросника через ${BURNS_TEST_INTERVAL_DAYS - daysSinceLastCompletion} дн.`,
      needToComplete: false,
      lastScore,
      scorePercent,
      completedAt: burnsTestResults[0].completedAt,
      buttonText: 'Открыть опросник'
    };
  };

  // Проверяем статус шкалы прокрастинации
  const checkProcrastinationScaleStatus = () => {
    const availableActivities = getAvailableActivities(unlockedContent.chapters);
    if (!availableActivities.has(ACTIVITY_IDS.PROCRASTINATION_SCALE)) return null;

    if (procrastinationTestResults.length === 0) {
      return {
        id: PROCRASTINATION_SCALE_ID,
        testId: ACTIVITY_IDS.PROCRASTINATION_SCALE,
        title: 'Шкала иррациональной прокрастинации',
        message: 'Пройдите тест на прокрастинацию',
        needToComplete: true,
        lastScore: null,
        scorePercent: null,
        completedAt: null,
        buttonText: 'Открыть тест'
      };
    }

    const lastCompletionDate = new Date(procrastinationTestResults[0].completedAt);
    const today = new Date(getCurrentDate());
    const daysSinceLastCompletion = getDaysDifference(today, lastCompletionDate);
    
    // Сохраняем последний результат
    const lastScore = procrastinationTestResults[0].score ?? null;
    const maxScore = procrastinationTestResults[0].maxScore || 45;
    const scorePercent = lastScore !== null ? Math.round((lastScore / maxScore) * 100) : null;

    if (daysSinceLastCompletion >= PROCRASTINATION_TEST_INTERVAL_DAYS) {
      return {
        id: PROCRASTINATION_SCALE_ID,
        testId: ACTIVITY_IDS.PROCRASTINATION_SCALE,
        title: 'Шкала иррациональной прокрастинации',
        message: procrastinationTestResults.length === 1
          ? 'Пройдите тест на прокрастинацию повторно (второй раз)'
          : 'Пройдите тест на прокрастинацию повторно',
        needToComplete: true,
        lastScore,
        scorePercent,
        completedAt: procrastinationTestResults[0].completedAt,
        buttonText: 'Открыть тест'
      };
    }

    return {
      id: PROCRASTINATION_SCALE_ID,
      testId: ACTIVITY_IDS.PROCRASTINATION_SCALE,
      title: 'Шкала иррациональной прокрастинации',
      message: `Следующее прохождение теста через ${PROCRASTINATION_TEST_INTERVAL_DAYS - daysSinceLastCompletion} дн.`,
      needToComplete: false,
      lastScore,
      scorePercent,
      completedAt: procrastinationTestResults[0].completedAt,
      buttonText: 'Открыть тест'
    };
  };

  // Получаем время работы с каждой методикой самооценки
  const threeCategoryTime = todayActivitiesProgress[ACTIVITY_IDS.THREE_COLUMNS_METHOD]?.timeSpent || 0;
  const diaryTime = todayActivitiesProgress[ACTIVITY_IDS.THOUGHT_DIARY]?.timeSpent || 0;
  const totalMethodsTime = threeCategoryTime + diaryTime;
  
  // Получаем время работы с методиками прокрастинации
  const procrastinationMethodsTime = Object.entries(todayActivitiesProgress)
    .filter(([key]) => {
      return key === ACTIVITY_IDS.PROCRASTINATION_DIARY ||
             key === ACTIVITY_IDS.ANTI_PROCRASTINATION ||
             key === ACTIVITY_IDS.DAILY_SCHEDULE ||
             key === ACTIVITY_IDS.PLEASURE_SHEET ||
             key === ACTIVITY_IDS.NO_BUTS ||
             key === ACTIVITY_IDS.SELF_SUPPORT ||
             key === ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS ||
             key === ACTIVITY_IDS.SMALL_STEPS ||
             key === ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION ||
             key === ACTIVITY_IDS.DISARMING_TECHNIQUE ||
             key === ACTIVITY_IDS.IMAGINE_SUCCESS ||
             key === ACTIVITY_IDS.COUNT_ACHIEVEMENTS ||
             key === ACTIVITY_IDS.CHECK_CANT_DO ||
             key === ACTIVITY_IDS.NO_LOSE_TECHNIQUE;
    })
    .reduce((total, [, data]) => total + (data?.timeSpent || 0), 0);
  
  const totalProcrastinationTime = procrastinationMethodsTime;

  // Создаем объекты задач
  const selfEsteemTask: MethodsTask = {
    id: 'self-esteem',
    title: 'Работа с самооценкой',
    description: 'Поработать с методом трёх колонок или Дневником автоматических мыслей (минимум 15 минут)',
    goalSeconds: METHODS_GOAL_SECONDS,
    methodIds: [
      { id: AUTOMATIC_THOUGHTS_ID, name: 'метод трёх колонок' },
      { id: ACTIVITY_IDS.THOUGHT_DIARY, name: 'дневник мыслей' }
    ],
    totalTime: totalMethodsTime
  };

  const procrastinationTask: MethodsTask = {
    id: 'procrastination',
    title: 'Работа с прокрастинацией',
    description: 'Поработать с методиками по преодолению прокрастинации (минимум 15 минут)',
    goalSeconds: PROCRASTINATION_GOAL_SECONDS,
    methodIds: [
      { id: ACTIVITY_IDS.SELF_ACTIVATION, name: 'список методов самоактивации' },
    ],
    totalTime: totalProcrastinationTime
  };

  const burnsStatus = checkBurnsStatus();
  const procrastinationScaleStatus = checkProcrastinationScaleStatus();

  const handleActivityClick = (activityId: string) => {
    switch (activityId) {
      case DAILY_MOOD_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.BURNS_CHECKLIST));
        break;
      case PROCRASTINATION_SCALE_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.PROCRASTINATION_SCALE));
        break;
      case AUTOMATIC_THOUGHTS_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.THREE_COLUMNS_METHOD));
        break;
      default:
        // Для избранных активностей передаем идентификатор напрямую
        // Здесь мы знаем, что activityId является валидным идентификатором активности
        dispatch(setSpecialContent(activityId as ActivityId));
        break;
    }

    // Прокрутка страницы вверх
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.container}>
      <FaviritesComponent onActivityClick={handleActivityClick} />
      
      <h2 className={styles.todayTasksTitle}>Задания на сегодня</h2>
      <div className={styles.tasksList}>
        <h3 className={styles.taskSectionTitle}>Ежедневное чтение</h3>
        <ReadingTaskComponent readingGoalSeconds={READING_GOAL_SECONDS} />
        
        {/* Компонент для отображения истории чтения */}
        <div className={styles.readingHistorySection}>
          <h4 className={styles.readingHistoryTitle}>Прогресс вашего чтения</h4>
          <ReadingHistoryBar readingGoalSeconds={READING_GOAL_SECONDS} />
        </div>

        <h3 className={styles.taskSectionTitle}>Работа с самооценкой</h3>
        <MethodsTaskComponent 
          task={selfEsteemTask}
          onActivityClick={handleActivityClick}
        />

        {/* Добавляем опросник Бернса в раздел работы с самооценкой */}
        {burnsStatus && (
          <TestTaskComponent 
            task={burnsStatus} 
            onActivityClick={handleActivityClick} 
          />
            )}

        {/* Обновленная секция с историей методов */}
        <div className={styles.methodsHistorySection}>
          <h4 className={styles.methodsHistoryTitle}>История работы с самооценкой</h4>
          <ActivityHistoryBar 
            goalSeconds={METHODS_GOAL_SECONDS} 
            config={{
              title: "История работы с самооценкой",
              emptyHistoryText: "История работы с методами самооценки пока отсутствует",
              activityIds: [ACTIVITY_IDS.THREE_COLUMNS_METHOD, ACTIVITY_IDS.THOUGHT_DIARY],
              testActivityId: ACTIVITY_IDS.BURNS_CHECKLIST,
              testScoreBadgeLabel: "опросника"
            }}
          />
        </div>

        {/* Раздел: Работа с прокрастинацией */}
        <h3 className={styles.taskSectionTitle}>Работа с прокрастинацией</h3>
        <MethodsTaskComponent 
          task={procrastinationTask}
          onActivityClick={handleActivityClick}
        />
        
        {/* Шкала прокрастинации */}
        {procrastinationScaleStatus && (
          <TestTaskComponent 
            task={procrastinationScaleStatus} 
            onActivityClick={handleActivityClick} 
          />
        )}

        {/* Секция с историей работы с прокрастинацией */}
        <div className={styles.procrastinationHistorySection}>
          <h4 className={styles.procrastinationHistoryTitle}>История работы с прокрастинацией</h4>
          <ActivityHistoryBar 
            goalSeconds={PROCRASTINATION_GOAL_SECONDS}
            config={{
              title: "История работы с прокрастинацией",
              emptyHistoryText: "История работы с прокрастинацией пока отсутствует",
              activityIds: [
                ACTIVITY_IDS.PROCRASTINATION_DIARY, 
                ACTIVITY_IDS.ANTI_PROCRASTINATION,
                ACTIVITY_IDS.DAILY_SCHEDULE,
                ACTIVITY_IDS.PLEASURE_SHEET,
                ACTIVITY_IDS.NO_BUTS,
                ACTIVITY_IDS.SELF_SUPPORT,
                ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS,
                ACTIVITY_IDS.SMALL_STEPS,
                ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION,
                ACTIVITY_IDS.DISARMING_TECHNIQUE,
                ACTIVITY_IDS.IMAGINE_SUCCESS,
                ACTIVITY_IDS.COUNT_ACHIEVEMENTS,
                ACTIVITY_IDS.CHECK_CANT_DO,
                ACTIVITY_IDS.NO_LOSE_TECHNIQUE
              ],
              testActivityId: ACTIVITY_IDS.PROCRASTINATION_SCALE,
              testScoreBadgeLabel: "теста"
            }}
          />
          </div>
      </div>
    </div>
  );
};

export default TodayTasks;
