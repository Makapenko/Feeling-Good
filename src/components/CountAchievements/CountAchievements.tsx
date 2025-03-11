import React, { useState, useEffect } from 'react';
import styles from './CountAchievements.module.css';

interface Achievement {
  id: string;
  text: string;
  date: string;
}

const CountAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [newAchievement, setNewAchievement] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    
    setAchievements([
      ...achievements,
      { 
        id: Math.random().toString(),
        text: newAchievement.trim(),
        date: today
      }
    ]);
    setNewAchievement('');
  };

  const removeAchievement = (id: string) => {
    setAchievements(achievements.filter(ach => ach.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAchievement();
    }
  };

  const getTodayAchievements = () => {
    return achievements.filter(ach => ach.date === today);
  };

  return (
    <div className={styles.container}>
      <h2>Считайте свои достижения</h2>

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
            placeholder="Опишите то, что вы сделали сегодня самостоятельно..."
            className={styles.input}
          />
          <button onClick={addAchievement} className={styles.addButton}>
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
