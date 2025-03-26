import React, { useMemo } from 'react';
import styles from './TodayTasks.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCurrentChapter, setSpecialContent } from '../../redux/slices/progressSlice';
import { getCurrentDate } from '../../utils/dateUtils';
import { getAvailableActivities } from '../../data/activitiesMapping';
import { getStoredActivityTime } from '../../utils/activityTimerStorage';
import chaptersData from '../ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
import { ActivityId, ACTIVITY_IDS, ACTIVITY_NAMES } from '../../constants/activities';

const typedChaptersData = chaptersData as ChaptersData;

// TODO Добавить график прогресса, который показывает количество проведённого времени и количество балоов в опроснике Бернса

const TodayTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  const currentDate = getCurrentDate();
  const todayProgress = progress.dailyProgress[currentDate];

  // Получаем избранные активности напрямую из Redux
  const favoriteActivities = useMemo(() => {
    const favoriteIds = progress.favoriteActivities || [];
    return favoriteIds.map(id => ({
      id,
      name: getActivityNameById(id)
    })).filter(activity => activity.name); // Фильтруем по наличию имени
  }, [progress.favoriteActivities]);

  // Функция для получения имени активности по ID
  function getActivityNameById(id: string): string {
    return ACTIVITY_NAMES[id as keyof typeof ACTIVITY_NAMES] || '';
  }

  // Находим первую непрочитанную главу или подглаву
  const findFirstUnreadChapter = () => {
    // Пропускаем первые три главы (acknowledgments, foreword, introduction)
    const mainChapters = typedChaptersData.chapters.slice(3);
    
    for (const chapter of mainChapters) {
      // Проверяем доступность главы
      if (!progress.unlockedContent.chapters.includes(chapter.id)) {
        continue;
      }

      // Если у главы есть подглавы
      if (chapter.sections && chapter.sections.length > 0) {
        for (const section of chapter.sections) {
          if (
            progress.unlockedContent.chapters.includes(section.id) && 
            !progress.completedChapters.includes(section.id)
          ) {
            return {
              id: section.id,
              title: section.title,
              path: section.path
            };
          }
        }
      } else if (!progress.completedChapters.includes(chapter.id)) {
        // Если это глава без подглав
        return {
          id: chapter.id,
          title: chapter.title,
          path: chapter.path
        };
      }
    }
    return null;
  };

  const handleReadingClick = async () => {
    if (readingGoalAchieved) return;

    const firstUnreadChapter = findFirstUnreadChapter();
    if (firstUnreadChapter && firstUnreadChapter.path) {
      try {
        const response = await fetch(firstUnreadChapter.path);
        const content = await response.text();
        
        dispatch(setCurrentChapter({
          id: firstUnreadChapter.id,
          title: firstUnreadChapter.title,
          content,
          timeSpent: 0,
          completed: false
        }));
      } catch (error) {
        console.error('Error loading chapter:', error);
      }
    }
  };

  // Подсчитываем общее время чтения за сегодня
  const getTotalReadingTime = () => {
    if (!todayProgress?.chapters) return 0;
    return Object.values(todayProgress.chapters).reduce(
      (total, chapter) => total + chapter.timeSpent,
      0
    );
  };

  const totalReadingTime = getTotalReadingTime();
  const readingGoalAchieved = totalReadingTime >= 300; // 5 минут = 300 секунд

  // Проверяем время работы с методами
  const totalMethodsTime = getStoredActivityTime(ACTIVITY_IDS.THREE_COLUMNS_METHOD) + 
                          getStoredActivityTime(ACTIVITY_IDS.THOUGHT_DIARY);
  const methodsGoalAchieved = totalMethodsTime >= 900; // 15 минут = 900 секунд

  // Проверяем статус опросника Бернса
  const checkBurnsStatus = () => {
    const availableActivities = getAvailableActivities(progress.unlockedContent.chapters);
    if (!availableActivities.has(ACTIVITY_IDS.BURNS_CHECKLIST)) return null;

    const burnsResults = Object.values(progress.dailyProgress)
      .flatMap(day => day.exercises.testResults)
      .filter(test => test?.id === 'burns-checklist')
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    if (burnsResults.length === 0) {
      return {
        needToComplete: true,
        message: 'Пройдите опросник депрессии Бернса'
      };
    }

    const lastCompletionDate = new Date(burnsResults[0].completedAt);
    const today = new Date();
    const daysSinceLastCompletion = Math.floor((today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastCompletion >= 7) {
      return {
        needToComplete: true,
        message: burnsResults.length === 1 
          ? 'Пройдите опросник Бернса повторно (второй раз)'
          : 'Пройдите опросник Бернса повторно'
      };
    }

    return {
      needToComplete: false,
      message: `Следующее прохождение опросника через ${7 - daysSinceLastCompletion} дн.`
    };
  };

  const burnsStatus = checkBurnsStatus();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Создадим константы для внутренних идентификаторов
  const DAILY_MOOD_ID = 'daily-mood';
  const AUTOMATIC_THOUGHTS_ID = 'automatic-thoughts';
  
  const handleActivityClick = (activityId: string) => {
    switch (activityId) {
      case DAILY_MOOD_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.BURNS_CHECKLIST));
        break;
      case AUTOMATIC_THOUGHTS_ID:
        dispatch(setSpecialContent(ACTIVITY_IDS.THREE_COLUMNS_METHOD));
        break;
      case ACTIVITY_IDS.THOUGHT_DIARY:
        dispatch(setSpecialContent(ACTIVITY_IDS.THOUGHT_DIARY));
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
      <h2>Задания на сегодня</h2>
      <div className={styles.tasksList}>
        <div 
          className={`${styles.task} ${!readingGoalAchieved ? styles.clickable : ''}`}
          onClick={handleReadingClick}
        >
          <div className={styles.taskHeader}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={readingGoalAchieved}
                readOnly
              />
            </div>
            <span className={styles.taskTitle}>
              Чтение (минимум 5 минут)
            </span>
          </div>
          <div className={styles.taskProgress}>
            <span className={styles.timeSpent}>
              Время чтения: {formatTime(totalReadingTime)}
            </span>
            {!readingGoalAchieved && (
              <>
                <span className={styles.remainingTime}>
                  Осталось: {formatTime(300 - totalReadingTime)}
                </span>
                <span className={styles.openLink}>
                  Нажмите, чтобы продолжить чтение
                </span>
              </>
            )}
          </div>
        </div>

        <div className={`${styles.task} ${!methodsGoalAchieved ? styles.clickable : ''}`}>
          <div className={styles.taskHeader}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={methodsGoalAchieved}
                readOnly
              />
            </div>
            <span className={styles.taskTitle}>
              Поработать с методом трёх колонок или Дневником автоматических мыслей (минимум 15 минут)
            </span>
          </div>
          <div className={styles.taskProgress}>
            <span className={styles.timeSpent}>
              Время работы: {formatTime(totalMethodsTime)}
            </span>
            {!methodsGoalAchieved && (
              <>
                <span className={styles.remainingTime}>
                  Осталось: {formatTime(900 - totalMethodsTime)}
                </span>
                <div className={styles.methodLinks}>
                  <span 
                    className={styles.openLink} 
                    onClick={() => handleActivityClick(AUTOMATIC_THOUGHTS_ID)}
                  >
                    Открыть метод трёх колонок
                  </span>
                  <span 
                    className={styles.openLink} 
                    onClick={() => handleActivityClick(ACTIVITY_IDS.THOUGHT_DIARY)}
                  >
                    Открыть дневник мыслей
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {burnsStatus && (
          <div 
            className={`${styles.task} ${burnsStatus.needToComplete ? styles.clickable : ''}`}
            onClick={burnsStatus.needToComplete ? () => handleActivityClick(DAILY_MOOD_ID) : undefined}
          >
            <div className={styles.taskHeader}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={!burnsStatus.needToComplete}
                  readOnly
                />
              </div>
              <span className={styles.taskTitle}>
                {burnsStatus.message}
              </span>
            </div>
            {!burnsStatus.needToComplete && (
              <div className={styles.taskProgress}>
                <span className={styles.timeSpent}>
                  {burnsStatus.message}
                </span>
              </div>
            )}
            {burnsStatus.needToComplete && (
              <div className={styles.taskProgress}>
                <span className={styles.openLink}>
                  Нажмите, чтобы открыть опросник
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {favoriteActivities.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранное</h2>
          <div className={styles.favoritesList}>
            {favoriteActivities.map(activity => (
              <div 
                key={activity.id} 
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => handleActivityClick(activity.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{activity.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayTasks; 
