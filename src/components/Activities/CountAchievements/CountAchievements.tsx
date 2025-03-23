import React, { useState, useMemo, useEffect } from 'react';
import styles from './CountAchievements.module.css';
import { useProgress } from '../../../store/ProgressContext';
import { CountAchievementsRecord, CountAchievementsExercise, Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../../../utils/dateUtils';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';

const SHEET_ID = ACTIVITY_IDS.COUNT_ACHIEVEMENTS;

const CountAchievements: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const [newAchievement, setNewAchievement] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  // Получаем статус избранного из Redux
  const isFavorite = useMemo(() => {
    return progress.favoriteActivities?.includes(SHEET_ID) || false;
  }, [progress.favoriteActivities]);

  // Добавление или удаление из избранного через Redux
  const toggleFavorite = () => {
    dispatch({
      type: 'TOGGLE_FAVORITE_ACTIVITY',
      activityId: SHEET_ID
    });
  };

  // Детектор мобильного устройства
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Получаем все записи из прогресса
  const records = useMemo(() => {
    const currentDate = getCurrentDate();
    const dayProgress = progress.dailyProgress[currentDate];
    const exercise = dayProgress?.exercises.exercises.find(
      (ex: Exercise): ex is CountAchievementsExercise =>
        ex.type === ACTIVITY_IDS.COUNT_ACHIEVEMENTS && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [progress.dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: CountAchievementsRecord[]) => {
    const exercise: CountAchievementsExercise = {
      type: ACTIVITY_IDS.COUNT_ACHIEVEMENTS,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.COUNT_ACHIEVEMENTS],
      completed: false,
      completedAt: '',
      records: updatedRecords
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;

    const newRecord: CountAchievementsRecord = {
      id: uuidv4(),
      text: newAchievement.trim(),
      timestamp: new Date().toISOString()
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
    return records.filter(record => record.timestamp.split('T')[0] === today);
  };

  const getPastAchievements = () => {
    // Группируем достижения по датам
    const pastRecords = records
      .filter(record => record.timestamp.split('T')[0] !== today)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const groupedByDate = pastRecords.reduce((groups: { [key: string]: CountAchievementsRecord[] }, record) => {
      const date = record.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});

    return Object.entries(groupedByDate)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
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
          <ChapterLinkButton activityId={SHEET_ID} className={styles.chapterButton} />
          <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            ★
          </button>
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
                        {new Date(achievement.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
