import React, { useState, useMemo } from 'react';
import styles from './MotivationWithoutCoercion.module.css';
import { useProgress } from '../../../store/ProgressContext';
import { MotivationWithoutCoercionRecord, MotivationWithoutCoercionExercise, Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../../../utils/dateUtils';

const SHEET_ID = 'motivation-without-coercion';
// TODO добавить отображение в ежедневных задачах
const MotivationWithoutCoercion: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const [currentThought, setCurrentThought] = useState('');
  const [currentAdvantage, setCurrentAdvantage] = useState('');
  const [currentDisadvantage, setCurrentDisadvantage] = useState('');
  const [activeRecord, setActiveRecord] = useState<MotivationWithoutCoercionRecord | null>(null);

  // Получаем все записи из прогресса
  const records = useMemo(() => {
    const currentDate = getCurrentDate();
    const dayProgress = progress.dailyProgress[currentDate];
    const exercise = dayProgress?.exercises.exercises.find(
      (ex: Exercise): ex is MotivationWithoutCoercionExercise =>
        ex.type === 'motivation-without-coercion' && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [progress.dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: MotivationWithoutCoercionRecord[]) => {
    const exercise: MotivationWithoutCoercionExercise = {
      type: 'motivation-without-coercion',
      id: SHEET_ID,
      name: 'Мотивация без принуждения',
      completed: false,
      completedAt: '',
      records: updatedRecords
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  const handleAddThought = () => {
    if (currentThought.trim()) {
      const newRecord: MotivationWithoutCoercionRecord = {
        id: uuidv4(),
        thought: currentThought,
        advantages: [],
        disadvantages: [],
        timestamp: new Date().toISOString()
      };
      const updatedRecords = [...records, newRecord];
      saveToProgress(updatedRecords);
      setActiveRecord(newRecord);
      setCurrentThought('');
    }
  };

  const handleAddAdvantage = () => {
    if (currentAdvantage.trim() && activeRecord) {
      const updatedRecords = records.map((record: MotivationWithoutCoercionRecord) =>
        record.id === activeRecord.id
          ? { ...record, advantages: [...record.advantages, currentAdvantage] }
          : record
      );
      saveToProgress(updatedRecords);
      setActiveRecord({ ...activeRecord, advantages: [...activeRecord.advantages, currentAdvantage] });
      setCurrentAdvantage('');
    }
  };

  const handleAddDisadvantage = () => {
    if (currentDisadvantage.trim() && activeRecord) {
      const updatedRecords = records.map((record: MotivationWithoutCoercionRecord) =>
        record.id === activeRecord.id
          ? { ...record, disadvantages: [...record.disadvantages, currentDisadvantage] }
          : record
      );
      saveToProgress(updatedRecords);
      setActiveRecord({ ...activeRecord, disadvantages: [...activeRecord.disadvantages, currentDisadvantage] });
      setCurrentDisadvantage('');
    }
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Мотивация без принуждения</h2>
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          ★
        </button>
      </div>
      <p className={styles.description}>
        Запишите мысль, которая вас беспокоит, и проанализируйте преимущества и недостатки
        этой ситуации, чтобы найти более сбалансированный взгляд.
      </p>

      <div className={styles.thoughtInput}>
        <input
          type="text"
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
          placeholder="Введите беспокоящую мысль..."
          className={styles.input}
        />
        <button
          onClick={handleAddThought}
          className={styles.addButton}
          disabled={!currentThought.trim()}
        >
          Добавить мысль
        </button>
      </div>
      {records.length > 0 && (
        <div className={styles.recordsList}>
          <h3>Записанные мысли:</h3>
          <div className={styles.thoughts}>
            {records.map((record: MotivationWithoutCoercionRecord) => (
              <button
                key={record.id}
                className={`${styles.thoughtButton} ${activeRecord?.id === record.id ? styles.active : ''}`}
                onClick={() => setActiveRecord(record)}
              >
                {record.thought}
              </button>
            ))}
          </div>
        </div>
      )}
      {activeRecord && (
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h3>Преимущества</h3>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={currentAdvantage}
                onChange={(e) => setCurrentAdvantage(e.target.value)}
                placeholder="Добавить преимущество..."
                className={styles.input}
              />
              <button
                onClick={handleAddAdvantage}
                className={styles.addButton}
                disabled={!currentAdvantage.trim()}
              >
                +
              </button>
            </div>
            <ul className={styles.list}>
              {activeRecord.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Недостатки</h3>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={currentDisadvantage}
                onChange={(e) => setCurrentDisadvantage(e.target.value)}
                placeholder="Добавить недостаток..."
                className={styles.input}
              />
              <button
                onClick={handleAddDisadvantage}
                className={styles.addButton}
                disabled={!currentDisadvantage.trim()}
              >
                +
              </button>
            </div>
            <ul className={styles.list}>
              {activeRecord.disadvantages.map((disadvantage, index) => (
                <li key={index}>{disadvantage}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotivationWithoutCoercion;
