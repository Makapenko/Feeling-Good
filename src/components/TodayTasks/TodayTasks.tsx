import React, { useState } from 'react';
import styles from './TodayTasks.module.css';
import {
  useAppDispatch,
  useExercisesByType,
  useUnlockedContent,
  useTestsByType,
  useTodayActivitiesProgress
} from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { getAvailableActivities } from '../../data/activitiesMapping';
import { ActivityId, ACTIVITY_IDS } from '../../constants/activities';
import {
  getDaysDifference,
  getCurrentDate,
  compareDatesDesc
} from '../../utils/dateUtils';
import ReadingHistoryBar from './ReadingHistoryBar';
import ActivityHistoryBar from './ActivityHistoryBar';
import TestTaskComponent from './TestTaskComponent';
import MethodsTaskComponent, { MethodsTask } from './MethodsTaskComponent';
import ReadingTaskComponent from './ReadingTaskComponent';
import FavoritesComponent from './FavoritesComponent';
import { MoodTrendChart } from '../MoodTrendChart';
import { DASTrendChart } from '../DASTrendChart';
import { IntimacyTrendChart } from '../IntimacyTrendChart';

// Константы для времени в секундах
const READING_GOAL_SECONDS = 300; // 5 минут
const METHODS_GOAL_SECONDS = 900; // 15 минут
const PROCRASTINATION_GOAL_SECONDS = 900; // 15 минут
const BURNS_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями опросника Бернса
const PROCRASTINATION_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями теста на прокрастинацию
const DAS_TEST_INTERVAL_DAYS = 14; // Интервал между прохождениями теста DAS (раз в 2 недели)
const LONELINESS_TEST_INTERVAL_DAYS = 14; // Интервал между прохождениями опросника одиночества
const INTIMACY_TEST_INTERVAL_DAYS = 14; // Интервал между прохождениями теста на способность к близости


const DAILY_MOOD_ID = 'daily-mood';
const AUTOMATIC_THOUGHTS_ID = 'automatic-thoughts';
const PROCRASTINATION_SCALE_ID = 'procrastination-scale';
const DAS_SCALE_ID = 'das-scale';
const LONELINESS_SCALE_ID = 'loneliness-scale';
const INTIMACY_SCALE_ID = 'intimacy-scale';

const PROCRASTINATION_ACTIVITY_IDS: string[] = [
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
  ACTIVITY_IDS.NO_LOSE_TECHNIQUE,
];

interface TestStatusConfig {
  id: string;
  testId: ActivityId;
  title: string;
  firstTimeMessage: string;
  retakeMessage: string;
  retakeSecondMessage: string;
  waitMessagePrefix: string;
  buttonText: string;
  intervalDays: number;
  defaultMaxScore: number;
}

interface TestResult {
  completedAt: string;
  score?: number;
  maxScore?: number;
}

function checkTestStatus(
  config: TestStatusConfig,
  testResults: TestResult[],
  availableActivities: Set<ActivityId>
) {
  if (!availableActivities.has(config.testId)) return null;

  const base = {
    id: config.id,
    testId: config.testId,
    title: config.title,
    buttonText: config.buttonText,
  };

  if (testResults.length === 0) {
    return {
      ...base,
      message: config.firstTimeMessage,
      needToComplete: true,
      lastScore: null,
      scorePercent: null,
      completedAt: null,
    };
  }

  const latest = testResults[0];
  const daysSince = getDaysDifference(
    new Date(getCurrentDate()),
    new Date(latest.completedAt)
  );
  const lastScore = latest.score ?? null;
  const maxScore = latest.maxScore || config.defaultMaxScore;
  const scorePercent = lastScore !== null ? Math.round((lastScore / maxScore) * 100) : null;

  if (daysSince >= config.intervalDays) {
    return {
      ...base,
      message: testResults.length === 1 ? config.retakeSecondMessage : config.retakeMessage,
      needToComplete: true,
      lastScore,
      scorePercent,
      completedAt: latest.completedAt,
    };
  }

  return {
    ...base,
    message: `${config.waitMessagePrefix} ${config.intervalDays - daysSince} дн.`,
    needToComplete: false,
    lastScore,
    scorePercent,
    completedAt: latest.completedAt,
  };
}

interface ExerciseTestStatusConfig {
  id: string;
  testId: ActivityId;
  title: string;
  buttonText: string;
  intervalDays: number;
  firstTimeMessage: string;
  retakeMessage: string;
  retakeSecondMessage: string;
  waitMessagePrefix: string;
  getScore: (exercise: any) => number | null;
  scoreToPercent: (score: number) => number;
}

function checkExerciseTestStatus(
  config: ExerciseTestStatusConfig,
  exercises: any[],
  availableActivities: Set<ActivityId>
) {
  if (!availableActivities.has(config.testId)) return null;

  const base = {
    id: config.id,
    testId: config.testId,
    title: config.title,
    buttonText: config.buttonText,
  };

  if (exercises.length === 0) {
    return {
      ...base,
      message: config.firstTimeMessage,
      needToComplete: true,
      lastScore: null,
      scorePercent: null,
      completedAt: null,
    };
  }

  const lastExercise = exercises[0];
  const completedAt = lastExercise.timestamp || lastExercise.completedAt;
  const daysSince = getDaysDifference(new Date(getCurrentDate()), new Date(completedAt));
  const lastScore = config.getScore(lastExercise);
  const scorePercent = lastScore !== null ? config.scoreToPercent(lastScore) : null;

  if (daysSince >= config.intervalDays) {
    return {
      ...base,
      message: exercises.length === 1 ? config.retakeSecondMessage : config.retakeMessage,
      needToComplete: true,
      lastScore,
      scorePercent,
      completedAt,
    };
  }

  return {
    ...base,
    message: `${config.waitMessagePrefix} ${config.intervalDays - daysSince} дн.`,
    needToComplete: false,
    lastScore,
    scorePercent,
    completedAt,
  };
}

const TodayTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();

  const burnsTestResults = useTestsByType(ACTIVITY_IDS.BURNS_CHECKLIST);
  const procrastinationTestResults = useTestsByType(ACTIVITY_IDS.PROCRASTINATION_SCALE);
  const lonelinessTestResults = useTestsByType(ACTIVITY_IDS.LONELINESS_SCALE);
  const todayActivitiesProgress = useTodayActivitiesProgress();

  const dasExercisesRaw = useExercisesByType(ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE);
  const dasExercises = [...dasExercisesRaw].sort((a: any, b: any) =>
    compareDatesDesc(a.timestamp || a.completedAt || '', b.timestamp || b.completedAt || '')
  );

  const intimacyExercisesRaw = useExercisesByType(ACTIVITY_IDS.INTIMACY_SCALE);
  const intimacyExercises = [...intimacyExercisesRaw].sort((a: any, b: any) =>
    compareDatesDesc(a.timestamp || a.completedAt || '', b.timestamp || b.completedAt || '')
  );

  const availableActivities = getAvailableActivities(unlockedContent.chapters);

  const totalMethodsTime =
    (todayActivitiesProgress[ACTIVITY_IDS.THREE_COLUMNS_METHOD]?.timeSpent || 0) +
    (todayActivitiesProgress[ACTIVITY_IDS.THOUGHT_DIARY]?.timeSpent || 0);

  const totalProcrastinationTime = Object.entries(todayActivitiesProgress)
    .filter(([key]) => PROCRASTINATION_ACTIVITY_IDS.includes(key))
    .reduce((total, [, data]) => total + (data?.timeSpent || 0), 0);

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

  const burnsStatus = checkTestStatus({
    id: DAILY_MOOD_ID,
    testId: ACTIVITY_IDS.BURNS_CHECKLIST,
    title: 'Опросник депрессии Бернса',
    firstTimeMessage: 'Пройдите опросник депрессии Бернса',
    retakeMessage: 'Пройдите опросник Бернса повторно',
    retakeSecondMessage: 'Пройдите опросник Бернса повторно (второй раз)',
    waitMessagePrefix: 'Следующее прохождение опросника через',
    buttonText: 'Открыть опросник',
    intervalDays: BURNS_TEST_INTERVAL_DAYS,
    defaultMaxScore: 100,
  }, burnsTestResults, availableActivities);

  const procrastinationScaleStatus = checkTestStatus({
    id: PROCRASTINATION_SCALE_ID,
    testId: ACTIVITY_IDS.PROCRASTINATION_SCALE,
    title: 'Шкала иррациональной прокрастинации',
    firstTimeMessage: 'Пройдите тест на прокрастинацию',
    retakeMessage: 'Пройдите тест на прокрастинацию повторно',
    retakeSecondMessage: 'Пройдите тест на прокрастинацию повторно (второй раз)',
    waitMessagePrefix: 'Следующее прохождение теста через',
    buttonText: 'Открыть тест',
    intervalDays: PROCRASTINATION_TEST_INTERVAL_DAYS,
    defaultMaxScore: 45,
  }, procrastinationTestResults, availableActivities);

  const dasStatus = checkExerciseTestStatus({
    id: DAS_SCALE_ID,
    testId: ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE,
    title: 'Шкала дисфункциональных убеждений',
    buttonText: 'Открыть тест',
    intervalDays: DAS_TEST_INTERVAL_DAYS,
    firstTimeMessage: 'Пройдите тест на дисфункциональные убеждения',
    retakeMessage: 'Пройдите тест DAS повторно',
    retakeSecondMessage: 'Пройдите тест DAS повторно (второй раз)',
    waitMessagePrefix: 'Следующее прохождение теста через',
    getScore: (ex) => ex.categoryResults?.reduce(
      (sum: number, cat: { score: number }) => sum + (cat.score || 0), 0
    ) ?? null,
    scoreToPercent: (score) => Math.round(((score + 70) / 140) * 100),
  }, dasExercises, availableActivities);

  const intimacyStatus = checkExerciseTestStatus({
    id: INTIMACY_SCALE_ID,
    testId: ACTIVITY_IDS.INTIMACY_SCALE,
    title: 'Тест на способность к близости',
    buttonText: 'Открыть тест',
    intervalDays: INTIMACY_TEST_INTERVAL_DAYS,
    firstTimeMessage: 'Пройдите тест на способность к близости',
    retakeMessage: 'Пройдите тест на близость повторно',
    retakeSecondMessage: 'Пройдите тест на близость повторно (второй раз)',
    waitMessagePrefix: 'Следующее прохождение теста через',
    getScore: (ex) => ex.totalScore ?? ex.categoryResults?.reduce(
      (sum: number, cat: { score: number }) => sum + (cat.score || 0), 0
    ) ?? null,
    scoreToPercent: (score) => Math.round((score / 180) * 100),
  }, intimacyExercises, availableActivities);

  const totalLonelinessMethodsTime =
    (todayActivitiesProgress[ACTIVITY_IDS.MOOD_JOURNAL]?.timeSpent || 0) +
    (todayActivitiesProgress[ACTIVITY_IDS.LONELINESS_PLEASURE_SHEET]?.timeSpent || 0);

  const lonelinessMethodsTask: MethodsTask = {
    id: 'loneliness-methods',
    title: 'Работа с одиночеством',
    description: 'Поработать с журналом настроения или бланком удовольствия (минимум 15 минут)',
    goalSeconds: METHODS_GOAL_SECONDS,
    methodIds: [
      { id: ACTIVITY_IDS.MOOD_JOURNAL, name: 'журнал настроения' },
      { id: ACTIVITY_IDS.LONELINESS_PLEASURE_SHEET, name: 'бланк удовольствия' },
    ],
    totalTime: totalLonelinessMethodsTime
  };

  const lonelinessStatus = checkTestStatus({
    id: LONELINESS_SCALE_ID,
    testId: ACTIVITY_IDS.LONELINESS_SCALE,
    title: 'Опросник одиночества',
    firstTimeMessage: 'Пройдите опросник одиночества',
    retakeMessage: 'Пройдите опросник одиночества повторно',
    retakeSecondMessage: 'Пройдите опросник одиночества повторно (второй раз)',
    waitMessagePrefix: 'Следующее прохождение опросника через',
    buttonText: 'Открыть опросник',
    intervalDays: LONELINESS_TEST_INTERVAL_DAYS,
    defaultMaxScore: 32,
  }, lonelinessTestResults, availableActivities);

  const handleActivityClick = (activityId: string) => {
    switch (activityId) {
      case DAILY_MOOD_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.BURNS_CHECKLIST));
        break;
      case PROCRASTINATION_SCALE_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.PROCRASTINATION_SCALE));
        break;
      case DAS_SCALE_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE));
        break;
      case LONELINESS_SCALE_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.LONELINESS_SCALE));
        break;
      case INTIMACY_SCALE_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.INTIMACY_SCALE));
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

  const [activeTab, setActiveTab] = useState<'reading' | 'beliefs' | 'procrastination' | 'loneliness'>('reading');

  const renderReadingAndSelfEsteemTab = () => (
    <>
      <h3 className={styles.taskSectionTitle}>Ежедневное чтение</h3>
      <ReadingTaskComponent readingGoalSeconds={READING_GOAL_SECONDS} />

      <div className={styles.readingHistorySection}>
        <h4 className={styles.readingHistoryTitle}>Прогресс вашего чтения</h4>
        <ReadingHistoryBar readingGoalSeconds={READING_GOAL_SECONDS} />
      </div>

      <h3 className={styles.taskSectionTitle}>Работа с самооценкой</h3>
      <MethodsTaskComponent
        task={selfEsteemTask}
        onActivityClick={handleActivityClick}
      />

      {burnsStatus && (
        <TestTaskComponent
          task={burnsStatus}
          onActivityClick={handleActivityClick}
        />
      )}

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

      {burnsTestResults.length > 0 && (
        <div className={styles.moodTrendSection}>
          <MoodTrendChart height={350} showStats={true} />
        </div>
      )}
    </>
  );

  const renderBeliefsTab = () => (
    <>
      <h3 className={styles.taskSectionTitle}>Работа с убеждениями</h3>

      {dasStatus && (
        <TestTaskComponent
          task={dasStatus}
          onActivityClick={handleActivityClick}
        />
      )}

      {dasExercises.length > 0 && (
        <div className={styles.dasTrendSection}>
          <DASTrendChart height={350} showStats={true} />
        </div>
      )}
    </>
  );

  const renderLonelinessTab = () => (
    <>
      <h3 className={styles.taskSectionTitle}>Работа с одиночеством</h3>

      {availableActivities.has(ACTIVITY_IDS.MOOD_JOURNAL) && (
        <MethodsTaskComponent
          task={lonelinessMethodsTask}
          onActivityClick={handleActivityClick}
        />
      )}

      {lonelinessStatus && (
        <TestTaskComponent
          task={lonelinessStatus}
          onActivityClick={handleActivityClick}
        />
      )}

      {intimacyStatus && (
        <TestTaskComponent
          task={intimacyStatus}
          onActivityClick={handleActivityClick}
        />
      )}

      {intimacyExercises.length > 0 && (
        <div className={styles.dasTrendSection}>
          <IntimacyTrendChart height={350} showStats={true} />
        </div>
      )}
    </>
  );

  const renderProcrastinationTab = () => (
    <>
      <h3 className={styles.taskSectionTitle}>Работа с прокрастинацией</h3>
      <MethodsTaskComponent
        task={procrastinationTask}
        onActivityClick={handleActivityClick}
      />

      {procrastinationScaleStatus && (
        <TestTaskComponent
          task={procrastinationScaleStatus}
          onActivityClick={handleActivityClick}
        />
      )}

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
    </>
  );

  return (
    <div className={styles.container}>
      <FavoritesComponent onActivityClick={handleActivityClick} />

      <h2 className={styles.todayTasksTitle}>Задания на сегодня</h2>

      <div className={styles.tasksTabs}>
        <button
          className={`${styles.tasksTab} ${activeTab === 'reading' ? styles.tasksTabActive : ''}`}
          onClick={() => setActiveTab('reading')}
        >
          Чтение и самооценка
        </button>
        <button
          className={`${styles.tasksTab} ${activeTab === 'beliefs' ? styles.tasksTabActive : ''}`}
          onClick={() => setActiveTab('beliefs')}
        >
          Убеждения
        </button>
        <button
          className={`${styles.tasksTab} ${activeTab === 'procrastination' ? styles.tasksTabActive : ''}`}
          onClick={() => setActiveTab('procrastination')}
        >
          Прокрастинация
        </button>
        <button
          className={`${styles.tasksTab} ${activeTab === 'loneliness' ? styles.tasksTabActive : ''}`}
          onClick={() => setActiveTab('loneliness')}
        >
          Одиночество
        </button>
      </div>

      <div className={styles.tasksList}>
        {activeTab === 'reading' && renderReadingAndSelfEsteemTab()}
        {activeTab === 'beliefs' && renderBeliefsTab()}
        {activeTab === 'procrastination' && renderProcrastinationTab()}
        {activeTab === 'loneliness' && renderLonelinessTab()}
      </div>
    </div>
  );
};

export default TodayTasks;
