import { useState } from 'react';
import styles from './PleasureSheet.module.css';
import { Activity } from './types';
import { v4 as uuidv4 } from 'uuid';

const RatingInput = ({ 
  value, 
  onChange, 
  placeholder = '', 
  isActual = false 
}: { 
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  isActual?: boolean;
}) => (
  <div className={styles.ratingInputContainer}>
    <div className={styles.ratingValue}>{value ?? '-'}%</div>
    <input
      type="range"
      min="0"
      max="100"
      step="5"
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`${styles.ratingInput} ${isActual ? styles.actualRating : ''}`}
    />
    {isActual && value === null && (
      <div className={styles.placeholder}>{placeholder}</div>
    )}
  </div>
);

const PleasureSheet = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    date: '',
    text: '',
    participants: '',
    expectedPleasure: 0
  });

  const handleAddActivity = () => {
    if (!newActivity.text.trim() || !newActivity.date) return;

    const activity: Activity = {
      id: uuidv4(),
      ...newActivity,
      actualPleasure: null
    };

    setActivities([...activities, activity]);
    setNewActivity({
      date: '',
      text: '',
      participants: '',
      expectedPleasure: 0
    });
  };

  const handleActivityChange = (
    activityId: string,
    field: 'actualPleasure',
    value: number
  ) => {
    setActivities(activities.map(activity => 
      activity.id === activityId ? { ...activity, [field]: value } : activity
    ));
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
  };

  return (
    <div className={styles.container}>
      <h2>Листок предполагаемого удовольствия</h2>
      <div className={styles.description}>
        <p>
          Запишите занятие, вызывающее удовлетворенность, с кем вы это делали и оцените
          предполагаемый уровень удовольствия перед занятием. После занятия запишите реальный
          уровень удовольствия.
        </p>
      </div>

      <div className={styles.addActivity}>
        <div className={styles.inputGroup}>
          <label>
            Дата:
            <input
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              className={styles.dateInput}
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newActivity.text}
            onChange={(e) => setNewActivity({ ...newActivity, text: e.target.value })}
            placeholder="Занятие..."
            className={styles.textInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newActivity.participants}
            onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
            placeholder="С кем? (если в одиночку, укажите «Я»)"
            className={styles.textInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.ratingLabel}>
            Предполагаемый уровень:
            <RatingInput
              value={newActivity.expectedPleasure}
              onChange={(value) => setNewActivity({ ...newActivity, expectedPleasure: value })}
            />
          </label>
        </div>
        <button onClick={handleAddActivity} className={styles.addButton}>
          Добавить
        </button>
      </div>

      <div className={styles.activityList}>
        <div className={styles.headers}>
          <div>Дата</div>
          <div>Занятие</div>
          <div>С кем</div>
          <div>Предполагаемый уровень</div>
          <div>Реальный уровень</div>
          <div></div>
        </div>

        {activities.map(activity => (
          <div key={activity.id} className={styles.activityRow}>
            <div>{new Date(activity.date).toLocaleDateString()}</div>
            <div>{activity.text}</div>
            <div>{activity.participants}</div>
            <div className={styles.ratingCell}>{activity.expectedPleasure}%</div>
            <div className={styles.ratingCell}>
              <RatingInput
                value={activity.actualPleasure}
                onChange={(value) => handleActivityChange(activity.id, 'actualPleasure', value)}
                placeholder="После занятия"
                isActual
              />
            </div>
            <button
              onClick={() => handleDeleteActivity(activity.id)}
              className={styles.deleteButton}
              aria-label="Удалить занятие"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {activities.length > 0 && (
        <div className={styles.analysis}>
          <h3>Анализ занятий</h3>
          <div className={styles.stats}>
            <div>
              <strong>Средняя разница в удовольствии: </strong>
              {Math.round(activities
                .filter(a => a.actualPleasure !== null)
                .reduce((acc, a) => acc + (a.actualPleasure! - a.expectedPleasure), 0) / 
                activities.filter(a => a.actualPleasure !== null).length || 0)}%
            </div>
            <div>
              <strong>Среднее удовольствие: </strong>
              {Math.round(activities
                .filter(a => a.actualPleasure !== null)
                .reduce((acc, a) => acc + a.actualPleasure!, 0) / 
                activities.filter(a => a.actualPleasure !== null).length || 0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PleasureSheet; 
