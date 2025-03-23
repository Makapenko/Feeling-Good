import React, { useState, useMemo, useEffect } from 'react';
import styles from './ImagineSuccess.module.css';
import { useProgress } from '../../../store/ProgressContext';
import { ImagineSuccessRecord, ImagineSuccessExercise, Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../../../utils/dateUtils';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';

// TODO нужно показывать цели и из прошлых дней, а не только за сегодня

const SHEET_ID = ACTIVITY_IDS.IMAGINE_SUCCESS;

const ImagineSuccess: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const [goal, setGoal] = useState('');
  const [advantages, setAdvantages] = useState<Array<{ id: string; text: string }>>([]);
  const [newAdvantage, setNewAdvantage] = useState('');
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingNewGoal, setIsAddingNewGoal] = useState(false);

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
      (ex: Exercise): ex is ImagineSuccessExercise =>
        ex.type === ACTIVITY_IDS.IMAGINE_SUCCESS && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [progress.dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: ImagineSuccessRecord[]) => {
    const exercise: ImagineSuccessExercise = {
      type: ACTIVITY_IDS.IMAGINE_SUCCESS,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.IMAGINE_SUCCESS],
      completed: false,
      completedAt: '',
      records: updatedRecords
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
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

  const addAdvantage = () => {
    if (!newAdvantage.trim()) return;

    const newAdvantageObj = {
      id: Math.random().toString(),
      text: newAdvantage.trim()
    };

    const updatedAdvantages = [...advantages, newAdvantageObj];
    setAdvantages(updatedAdvantages);
    setNewAdvantage('');

    // Обновляем существующую запись или создаем новую
    const updatedRecords = records.filter(record => record.id !== currentRecordId);
    const newRecord: ImagineSuccessRecord = {
      id: currentRecordId || uuidv4(),
      goal,
      advantages: updatedAdvantages,
      timestamp: new Date().toISOString()
    };
    setCurrentRecordId(newRecord.id);
    saveToProgress([...updatedRecords, newRecord]);
  };

  const removeAdvantage = (id: string) => {
    const updatedAdvantages = advantages.filter(adv => adv.id !== id);
    setAdvantages(updatedAdvantages);

    // Обновляем существующую запись
    const updatedRecords = records.filter(record => record.id !== currentRecordId);
    const newRecord: ImagineSuccessRecord = {
      id: currentRecordId || uuidv4(),
      goal,
      advantages: updatedAdvantages,
      timestamp: new Date().toISOString()
    };
    saveToProgress([...updatedRecords, newRecord]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAdvantage();
    }
  };

  const handleAddGoal = () => {
    if (!goal.trim()) return;

    // Создаем новую запись
    const newRecord: ImagineSuccessRecord = {
      id: uuidv4(),
      goal,
      advantages: [],
      timestamp: new Date().toISOString()
    };

    saveToProgress([...records, newRecord]);
    setCurrentRecordId(newRecord.id);
    setAdvantages([]);
    setIsAddingNewGoal(false);
  };

  const selectRecord = (record: ImagineSuccessRecord) => {
    setCurrentRecordId(record.id);
    setGoal(record.goal);
    setAdvantages(record.advantages);
    setIsAddingNewGoal(false);
  };

  const startNewRecord = () => {
    setCurrentRecordId(null);
    setGoal('');
    setAdvantages([]);
    setNewAdvantage('');
    setIsAddingNewGoal(true);
  };

  const cancelAddingGoal = () => {
    setIsAddingNewGoal(false);
    setGoal('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Представьте успех</h2>
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

      {isAddingNewGoal && (
        <div className={styles.section}>
          <h3>Определите свою цель</h3>
          <div className={styles.goalInput}>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={isMobile ? "Ваша цель..." : "Например: бросить курить, начать бегать по утрам..."}
              className={styles.input}
              autoFocus
            />
            <div className={styles.buttonGroup}>
              <button
                onClick={handleAddGoal}
                className={styles.addButton}
                disabled={!goal.trim()}
              >
                Добавить цель
              </button>
              <button
                onClick={cancelAddingGoal}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.recordsList}>
        <div className={styles.recordsHeader}>
          <h3>{records.length > 0 ? 'Сохраненные цели:' : 'Нет сохраненных целей'}</h3>
          {!isAddingNewGoal && (
            <button
              onClick={startNewRecord}
              className={styles.newRecordButton}
            >
              + Новая цель
            </button>
          )}
        </div>
        {records.length > 0 && (
          <div className={styles.goals}>
            {records.map((record) => (
              <button
                key={record.id}
                className={`${styles.goalButton} ${currentRecordId === record.id ? styles.active : ''}`}
                onClick={() => selectRecord(record)}
              >
                {record.goal}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentRecordId && (
        <div className={styles.section}>
          <h3>Шаг 1: Список преимуществ</h3>
          <p className={styles.description}>
            Составьте список всех положительных последствий, которые вы получите после достижения цели.
            Перечислите как можно больше пунктов.
          </p>

          <div className={styles.advantagesInput}>
            <input
              type="text"
              value={newAdvantage}
              onChange={(e) => setNewAdvantage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isMobile ? "Введите преимущество" : "Введите преимущество и нажмите Enter"}
              className={styles.input}
            />
            <button onClick={addAdvantage} className={styles.addButton} disabled={!newAdvantage.trim()}>
              Добавить
            </button>
          </div>

          <div className={styles.advantagesList}>
            {advantages.map((advantage, index) => (
              <div key={advantage.id} className={styles.advantageItem}>
                <span className={styles.advantageNumber}>{index + 1}.</span>
                <span className={styles.advantageText}>{advantage.text}</span>
                <button
                  onClick={() => removeAdvantage(advantage.id)}
                  className={styles.removeButton}
                  aria-label="Удалить преимущество"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentRecordId && (
        <>
          <div className={styles.section}>
            <h3>Шаг 2: Расслабление</h3>
            <div className={styles.relaxationStep}>
              <p>Каждый вечер перед сном:</p>
              <ol>
                <li>Представьте себя в любимом месте (например, в горах или на пляже)</li>
                <li>Сосредоточьтесь на приятных деталях окружающей обстановки</li>
                <li>Позвольте своему телу полностью расслабиться</li>
                <li>Почувствуйте, как напряжение покидает каждую мышцу</li>
                <li>Наблюдайте за своим состоянием покоя и умиротворения</li>
              </ol>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Шаг 3: Визуализация успеха</h3>
            <div className={styles.visualizationStep}>
              <p>Оставаясь в расслабленном состоянии:</p>
              <ol>
                <li>Представьте, что вы уже достигли своей цели</li>
                <li>Мысленно проговорите каждое преимущество из вашего списка</li>
                <li>Для каждого пункта используйте формулировку в настоящем времени:</li>
                <div className={styles.example}>
                  {goal && advantages.length > 0 ? (
                    advantages.map(advantage => (
                      <p key={advantage.id}>
                        "Теперь я {advantage.text.toLowerCase()}, и мне это нравится."
                      </p>
                    ))
                  ) : (
                    <p className={styles.placeholder}>
                      Добавьте преимущества, чтобы увидеть примеры утверждений
                    </p>
                  )}
                </div>
              </ol>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagineSuccess; 
