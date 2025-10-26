import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { getStreakInfo, getStreakMotivationalMessage, isActiveToday } from '../../../utils/streakUtils';
import styles from './StreakDisplay.module.css';

interface StreakDisplayProps {
  variant?: 'full' | 'compact';
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ variant = 'full' }) => {
  const streakInfo = useAppSelector(getStreakInfo);
  const activeToday = useAppSelector(isActiveToday);
  const message = getStreakMotivationalMessage(streakInfo.currentStreak);

  if (variant === 'compact') {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.streakIcon}>🔥</div>
        <div className={styles.compactStreak}>
          <span className={styles.streakNumber}>{streakInfo.currentStreak}</span>
          <span className={styles.streakLabel}>дней подряд</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainStreak}>
        <div className={styles.streakIconLarge}>
          {streakInfo.currentStreak > 0 ? '🔥' : '💤'}
        </div>
        <div className={styles.streakContent}>
          <div className={styles.streakValue}>
            {streakInfo.currentStreak}
            <span className={styles.streakUnit}>
              {streakInfo.currentStreak === 1 ? ' день' : ' дней'}
            </span>
          </div>
          <div className={styles.streakMessage}>{message}</div>
        </div>
      </div>

      {activeToday && streakInfo.currentStreak > 0 && (
        <div className={styles.todayBadge}>
          ✓ Сегодня вы уже активны!
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{streakInfo.longestStreak}</div>
          <div className={styles.statLabel}>Рекорд</div>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{streakInfo.totalActiveDays}</div>
          <div className={styles.statLabel}>Всего дней</div>
        </div>
      </div>

      {streakInfo.currentStreak === 0 && streakInfo.lastActivityDate && (
        <div className={styles.reminder}>
          <span className={styles.reminderIcon}>💡</span>
          <span className={styles.reminderText}>
            Последняя активность: {new Date(streakInfo.lastActivityDate).toLocaleDateString('ru-RU')}
          </span>
        </div>
      )}
    </div>
  );
};
