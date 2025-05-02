import styles from './TodayTasks.module.css';
import { useCompletedChapters, useTodayProgress, useUnlockedContent, useAppDispatch } from '../../redux/hooks';
import { ChaptersData } from '../../types/chapters.types';
import chaptersData from '../ListOfChapters/chapters.json';
import { formatTimeFromSeconds } from '../../utils/dateUtils';
import { loadChapter } from '../../redux/actions/chapterActions';

// Типизируем импортированные JSON-данные
const typedChaptersData = chaptersData as ChaptersData;


const ReadingTaskComponent: React.FC<{ readingGoalSeconds: number }> = ({ readingGoalSeconds }) => {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();
  const completedChapters = useCompletedChapters();
  const formatTime = formatTimeFromSeconds;
  const todayProgress = useTodayProgress();

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

  // Подсчитываем общее время чтения за сегодня
  const getTotalReadingTime = () => {
    if (!todayProgress?.chapters) return 0;
    return Object.values(todayProgress.chapters).reduce(
      (total, chapter) => total + chapter.timeSpent,
      0
    );
  };


  const totalReadingTime = getTotalReadingTime();
  const readingGoalAchieved = totalReadingTime >= readingGoalSeconds;


  const handleReadingClick = async () => {
    const firstUnreadChapter = findFirstUnreadChapter();

    if (firstUnreadChapter) {
      try {
        // Используем экшен loadChapter для загрузки главы
        await dispatch(loadChapter(firstUnreadChapter.id));
      } catch (error) {
        console.error('Ошибка загрузки главы:', error);
        alert('Упс. Что-то пошло не так во время загрузки главы.');
      }
    } else {
      alert('Упс. Что-то пошло не так. Глава не найдена.');
    }
  };


  return (

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
              Осталось: {formatTime(readingGoalSeconds - totalReadingTime)}
            </span>
            <span
              className={styles.openLink}
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем всплытие события

                handleReadingClick();
              }}
            >
              Продолжить чтение
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ReadingTaskComponent;
