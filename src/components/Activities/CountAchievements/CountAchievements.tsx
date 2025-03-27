import React, { useState, useMemo } from 'react';
import styles from './CountAchievements.module.css';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { CountAchievementsRecord, CountAchievementsExercise, Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getCurrentISOTimestamp, formatDateWithOptions, formatTime, compareDatesDesc } from '../../../utils/dateUtils';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { useIsMobile } from '../../../utils/deviceUtils';

const SHEET_ID = ACTIVITY_IDS.COUNT_ACHIEVEMENTS;

const CountAchievements: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [newAchievement, setNewAchievement] = useState('');
  const isMobile = useIsMobile();

  // Получаем все записи из прогресса
  const records = useMemo(() => {
    const currentDate = getCurrentDate();
    const dayProgress = dailyProgress[currentDate];
    const exercise = dayProgress?.exercises.exercises.find(
      (ex: Exercise): ex is CountAchievementsExercise =>
        ex.type === ACTIVITY_IDS.COUNT_ACHIEVEMENTS && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: CountAchievementsRecord[]) => {
    const exercise: CountAchievementsExercise = {
      type: ACTIVITY_IDS.COUNT_ACHIEVEMENTS,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.COUNT_ACHIEVEMENTS],
      completed: true,
      completedAt: getCurrentISOTimestamp(),
      records: updatedRecords
    };

    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;

    const newRecord: CountAchievementsRecord = {
      id: uuidv4(),
      text: newAchievement.trim(),
      timestamp: getCurrentISOTimestamp()
    };

    saveToProgress([...records, newRecord]);
    setNewAchievement('');
  };

  const removeAchievement = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    saveToProgress(updatedRecords);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAchievement();
    }
  };

  const getTodayAchievements = () => {
    const currentDate = getCurrentDate();
    return records.filter(record => record.timestamp.split('T')[0] === currentDate);
  };

  const getPastAchievements = () => {
    // Группируем достижения по датам
    const currentDate = getCurrentDate();
    const pastRecords = records
      .filter(record => record.timestamp.split('T')[0] !== currentDate)
      .sort((a, b) => compareDatesDesc(a.timestamp, b.timestamp));

    const groupedByDate = pastRecords.reduce((groups: { [key: string]: CountAchievementsRecord[] }, record) => {
      const date = record.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});

    return Object.entries(groupedByDate)
      .sort(([dateA], [dateB]) => compareDatesDesc(dateA, dateB));
  };

  const formatDate = (dateString: string) => {
    return formatDateWithOptions(dateString, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Считайте свои достижения</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>

      <div className={styles.description}>
        <h3>О методе</h3>
        <p>
          Этот метод помогает преодолеть негативное мышление и повысить уверенность в себе путем
          подсчета ваших ежедневных достижений. Каждый вечер записывайте все, что вы сделали
          самостоятельно, без напоминаний и подталкиваний со стороны других людей.
        </p>
        <div className={styles.tips}>
          <h4>Рекомендации:</h4>
          <ul>
            <li>Записывайте даже небольшие достижения</li>
            <li>Обращайте внимание на вещи, которые делаете "автоматически"</li>
            <li>Не преуменьшайте значимость своих действий</li>
            <li>Ведите список регулярно, каждый день</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Достижения за сегодня ({getTodayAchievements().length})</h3>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMobile ? "Ваше достижение..." : "Опишите то, что вы сделали сегодня самостоятельно..."}
            className={styles.input}
          />
          <button
            onClick={addAchievement}
            className={styles.addButton}
            disabled={!newAchievement.trim()}
          >
            Добавить
          </button>
        </div>

        <div className={styles.achievementsList}>
          {getTodayAchievements().length > 0 ? (
            getTodayAchievements().map((achievement, index) => (
              <div key={achievement.id} className={styles.achievementItem}>
                <span className={styles.achievementNumber}>{index + 1}.</span>
                <span className={styles.achievementText}>{achievement.text}</span>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className={styles.removeButton}
                  aria-label="Удалить достижение"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className={styles.placeholder}>
              Добавьте ваше первое достижение за сегодня!
            </p>
          )}
        </div>
      </div>

      {getPastAchievements().length > 0 && (
        <div className={styles.section}>
          <h3>История достижений</h3>
          <div className={styles.historyList}>
            {getPastAchievements().map(([date, dayAchievements]) => (
              <div key={date} className={styles.historyDay}>
                <h4 className={styles.historyDate}>{formatDate(date)}</h4>
                <div className={styles.achievementsList}>
                  {dayAchievements.map((achievement, index) => (
                    <div key={achievement.id} className={styles.achievementItem}>
                      <span className={styles.achievementNumber}>{index + 1}.</span>
                      <span className={styles.achievementText}>{achievement.text}</span>
                      <span className={styles.achievementTime}>
                        {formatTime(achievement.timestamp)}
                      </span>
                      <button
                        onClick={() => removeAchievement(achievement.id)}
                        className={styles.removeButton}
                        aria-label="Удалить достижение"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.motivation}>
        <p>
          Помните: каждое действие, которое вы совершаете самостоятельно,
          укрепляет вашу уверенность в себе и доказывает, что вы способны
          на большее, чем думаете.
        </p>
      </div>
    </div>
  );
};

export default CountAchievements; 
