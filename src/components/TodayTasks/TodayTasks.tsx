import React, { useMemo } from 'react';
import styles from './TodayTasks.module.css';
import {
  useAppDispatch,
  useUnlockedContent,
  useCompletedChapters,
  useFavoriteActivities,
  useFavoriteChapters,
  useTodayProgress,
  useTestsByType,
  useTodayActivitiesProgress
} from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { loadChapter } from '../../redux/actions/chapterActions';
import { getAvailableActivities } from '../../data/activitiesMapping';
import chaptersData from '../ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
import { ActivityId, ACTIVITY_IDS, ACTIVITY_NAMES } from '../../constants/activities';
import {
  formatTimeFromSeconds,
  getDaysDifference,
  getCurrentDate,
  formatDateWithOptions
} from '../../utils/dateUtils';
import ReadingHistoryBar from './ReadingHistoryBar';
import MethodsHistoryBar from './MethodsHistoryBar';

// Константы для времени в секундах
const READING_GOAL_SECONDS = 300; // 5 минут
const METHODS_GOAL_SECONDS = 900; // 15 минут
const BURNS_TEST_INTERVAL_DAYS = 7; // Интервал между прохождениями опросника Бернса

// Типизируем импортированные JSON-данные
const typedChaptersData = chaptersData as ChaptersData;


const TodayTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();
  const completedChapters = useCompletedChapters();
  const favoriteActivitiesIds = useFavoriteActivities();
  const favoriteChapters = useFavoriteChapters();
  const todayProgress = useTodayProgress();
  const burnsTestResults = useTestsByType(ACTIVITY_IDS.BURNS_CHECKLIST);
  const todayActivitiesProgress = useTodayActivitiesProgress();

  // Получаем избранные активности напрямую из Redux
  const favoriteActivities = useMemo(() => {
    const favoriteIds = favoriteActivitiesIds || [];
    return favoriteIds.map(id => ({
      id,
      name: getActivityNameById(id)
    })).filter(activity => activity.name); // Фильтруем по наличию имени
  }, [favoriteActivitiesIds]);

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
      if (!unlockedContent.chapters.includes(chapter.id)) {
        continue;
      }

      // Если у главы есть подглавы
      if (chapter.sections && chapter.sections.length > 0) {
        for (const section of chapter.sections) {
          if (
            unlockedContent.chapters.includes(section.id) &&
            !completedChapters.includes(section.id)
          ) {
            return {
              id: section.id,
              title: section.title
            };
          }
        }
      } else if (!completedChapters.includes(chapter.id)) {
        // Если это глава без подглав
        return {
          id: chapter.id,
          title: chapter.title
        };
      }
    }
    return null;
  };

  const handleReadingClick = async () => {
    const firstUnreadChapter = findFirstUnreadChapter();
    
    if (firstUnreadChapter) {
      try {
        // Используем экшен loadChapter для загрузки главы
        await dispatch(loadChapter(firstUnreadChapter.id));
      } catch (error) {
        console.error('Ошибка загрузки главы:', error);
        alert('Не удалось загрузить главу. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
      }
    } else {
      alert('Все доступные главы уже прочитаны. Попробуйте открыть другие главы или подождите новый контент.');
    }
  };

  // Проверяем статус опросника Бернса
  const checkBurnsStatus = () => {
    const availableActivities = getAvailableActivities(unlockedContent.chapters);
    if (!availableActivities.has(ACTIVITY_IDS.BURNS_CHECKLIST)) return null;

    if (burnsTestResults.length === 0) {
      return {
        needToComplete: true,
        message: 'Пройдите опросник депрессии Бернса',
        lastScore: null,
        completedAt: null
      };
    }

    const lastCompletionDate = new Date(burnsTestResults[0].completedAt);
    const today = new Date(getCurrentDate());
    const daysSinceLastCompletion = getDaysDifference(today, lastCompletionDate);
    
    // Сохраняем последний результат
    const lastScore = burnsTestResults[0].score;
    const maxScore = burnsTestResults[0].maxScore || 100;
    const scorePercent = lastScore !== undefined ? Math.round((lastScore / maxScore) * 100) : null;

    if (daysSinceLastCompletion >= BURNS_TEST_INTERVAL_DAYS) {
      return {
        needToComplete: true,
        message: burnsTestResults.length === 1
          ? 'Пройдите опросник Бернса повторно (второй раз)'
          : 'Пройдите опросник Бернса повторно',
        lastScore,
        scorePercent,
        completedAt: burnsTestResults[0].completedAt
      };
    }

    return {
      needToComplete: false,
      message: `Следующее прохождение опросника через ${BURNS_TEST_INTERVAL_DAYS - daysSinceLastCompletion} дн.`,
      lastScore,
      scorePercent,
      completedAt: burnsTestResults[0].completedAt
    };
  };

  // Получаем время работы с каждой методикой
  const threeCategoryTime = todayActivitiesProgress[ACTIVITY_IDS.THREE_COLUMNS_METHOD]?.timeSpent || 0;
  const diaryTime = todayActivitiesProgress[ACTIVITY_IDS.THOUGHT_DIARY]?.timeSpent || 0;
  const totalMethodsTime = threeCategoryTime + diaryTime;
  const methodsGoalAchieved = totalMethodsTime >= METHODS_GOAL_SECONDS;

  const burnsStatus = checkBurnsStatus();

  // Используем утилиту форматирования времени
  const formatTime = formatTimeFromSeconds;

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

  // Функция для перехода к чтению избранной главы
  const handleFavoriteChapterClick = async (chapterId: string) => {
    try {
      // Используем экшен loadChapter для загрузки избранной главы
      await dispatch(loadChapter(chapterId));
    } catch (error) {
      console.error('Ошибка загрузки главы:', error);
      alert('Не удалось загрузить главу. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
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
  const readingGoalAchieved = totalReadingTime >= READING_GOAL_SECONDS;

  return (
    <div className={styles.container}>
      <h2>Задания на сегодня</h2>
      <div className={styles.tasksList}>
        <h3 className={styles.taskSectionTitle}>Ежедневное чтение</h3>
        <div
          className={`${styles.task} ${!readingGoalAchieved ? styles.clickable : ''}`}
          onClick={!readingGoalAchieved ? handleReadingClick : undefined}
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
                  Осталось: {formatTime(READING_GOAL_SECONDS - totalReadingTime)}
                </span>
                <span 
                  className={styles.openLink} 
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    console.log('Клик на кнопке "Продолжить чтение"');
                    handleReadingClick();
                  }}
                >
                  Продолжить чтение →
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Компонент для отображения истории чтения */}
        <div className={styles.readingHistorySection}>
          <h4 className={styles.readingHistoryTitle}>Прогресс вашего чтения</h4>
          <ReadingHistoryBar readingGoalSeconds={READING_GOAL_SECONDS} />
        </div>

        <h3 className={styles.taskSectionTitle}>Работа с самооценкой</h3>
        <div className={`${styles.task} ${!methodsGoalAchieved ? styles.clickable : ''}`}
             onClick={!methodsGoalAchieved ? () => handleActivityClick(AUTOMATIC_THOUGHTS_ID) : undefined}
        >
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
                  Осталось: {formatTime(METHODS_GOAL_SECONDS - totalMethodsTime)}
                </span>
                <div className={styles.methodLinks}>
                  <span
                    className={styles.openLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityClick(AUTOMATIC_THOUGHTS_ID);
                    }}
                  >
                    Открыть метод трёх колонок
                  </span>
                  <span
                    className={styles.openLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityClick(ACTIVITY_IDS.THOUGHT_DIARY);
                    }}
                  >
                    Открыть дневник мыслей
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Обновленная секция с историей методов */}
        <div className={styles.methodsHistorySection}>
          <h4 className={styles.methodsHistoryTitle}>История работы с самооценкой</h4>
          <MethodsHistoryBar readingGoalSeconds={READING_GOAL_SECONDS} />
        </div>

        {/* Модифицированный блок опросника */}
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
            
            <div className={styles.taskProgress}>
              {/* Показываем информацию о последнем результате, если он есть */}
              {burnsStatus.lastScore !== null && (
                <div className={styles.burnsResultContainer}>
                  <div className={styles.burnsScoreInfo}>
                    <span className={styles.burnsScoreLabel}>Последний результат:</span>
                    <span className={styles.burnsScoreValue}>
                      {burnsStatus.lastScore} баллов
                      {burnsStatus.scorePercent !== null && ` (${burnsStatus.scorePercent}%)`}
                    </span>
                    <span className={styles.burnsScoreDate}>
                      {formatDateWithOptions(burnsStatus.completedAt || '')}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Показываем кнопку прохождения, если нужно */}
              {burnsStatus.needToComplete && (
                <span 
                  className={styles.openLink}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivityClick(DAILY_MOOD_ID);
                  }}
                >
                  Открыть опросник
                </span>
              )}
              
              {!burnsStatus.needToComplete && (
                <span className={styles.timeSpent}>
                  {burnsStatus.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

     
      {favoriteActivities.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные задания</h2>
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

      {favoriteChapters.length > 0 && (
        <>
          <h2 className={styles.favoritesTitle}>Избранные главы</h2>
          <div className={styles.favoritesList}>
            {favoriteChapters.map(chapter => (
              <div
                key={chapter.id}
                className={`${styles.favoriteItem} ${styles.clickable}`}
                onClick={() => handleFavoriteChapterClick(chapter.id)}
              >
                <div className={styles.favoriteIcon}>★</div>
                <span className={styles.favoriteTitle}>{chapter.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayTasks;
