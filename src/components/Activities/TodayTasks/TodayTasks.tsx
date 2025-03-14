import React from 'react';
import styles from './TodayTasks.module.css';
import { useProgress } from '../../../store/ProgressContext';
import { getCurrentDate } from '../../../utils/dateUtils';
import { getAvailableActivities } from '../../../data/activitiesMapping';

const TodayTasks: React.FC = () => {
  const { progress } = useProgress();
  const currentDate = getCurrentDate();
  const todayProgress = progress.dailyProgress[currentDate];

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

  // Проверяем статус опросника Бернса
  const checkBurnsStatus = () => {
    const availableActivities = getAvailableActivities(progress.unlockedContent.chapters);
    if (!availableActivities.has('burns-checklist')) return null;

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

  return (
    <div className={styles.container}>
      <h2>Задания на сегодня</h2>
      <div className={styles.tasksList}>
        <div className={styles.task}>
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
              <span className={styles.remainingTime}>
                Осталось: {formatTime(300 - totalReadingTime)}
              </span>
            )}
          </div>
        </div>

        {burnsStatus && (
          <div className={styles.task}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayTasks; 
