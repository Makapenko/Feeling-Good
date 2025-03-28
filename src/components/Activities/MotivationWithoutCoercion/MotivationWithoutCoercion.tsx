import React, { useState, useMemo, useEffect } from 'react';
import styles from './MotivationWithoutCoercion.module.css';
import { v4 as uuidv4 } from 'uuid';
import { ACTIVITY_IDS } from '../../../constants/activities';
import { MotivationWithoutCoercionRecord, MotivationWithoutCoercionExercise, Exercise } from '../../../types/progress.types';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID = ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION;


const MotivationWithoutCoercion: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [currentThought, setCurrentThought] = useState('');
  const [currentAdvantage, setCurrentAdvantage] = useState('');
  const [currentDisadvantage, setCurrentDisadvantage] = useState('');
  const [activeRecord, setActiveRecord] = useState<MotivationWithoutCoercionRecord | null>(null);

  // Получаем все записи из прогресса, включая записи из прошлых дней
  const records = useMemo(() => {
    // Собираем все записи из всех дней
    let allRecords: MotivationWithoutCoercionRecord[] = [];
    
    // Проходим по всем дням в прогрессе
    Object.values(dailyProgress).forEach(dayProgress => {
      const exercise = dayProgress?.exercises.exercises.find(
        (ex: Exercise): ex is MotivationWithoutCoercionExercise =>
          ex.type === SHEET_ID && ex.id === SHEET_ID
      );
      
      if (exercise?.records?.length) {
        allRecords = [...allRecords, ...exercise.records];
      }
    });
    
    // Сортируем по времени создания (от новых к старым)
    return allRecords.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [dailyProgress]);

  // Активируем последнюю мысль после загрузки страницы
  useEffect(() => {
    if (records.length > 0 && !activeRecord) {
      // Выбираем самую последнюю запись
      setActiveRecord(records[0]);
    }
  }, [records]); // eslint-disable-line react-hooks/exhaustive-deps

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: MotivationWithoutCoercionRecord[]) => {
    const exercise: MotivationWithoutCoercionExercise = {
      ...createBaseExercise(SHEET_ID),
      records: updatedRecords
    };

    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  const handleAddThought = () => {
    if (currentThought.trim()) {
      const newRecord: MotivationWithoutCoercionRecord = {
        id: uuidv4(),
        thought: currentThought,
        advantages: [],
        disadvantages: [],
        timestamp: getCurrentISOTimestamp()
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

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Мотивация без принуждения</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
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
