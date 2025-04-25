import React, { useState, useMemo, useEffect } from 'react';
import styles from './ImagineSuccess.module.css';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { ImagineSuccessRecord, ImagineSuccessExercise } from './types';
import { Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { useIsMobile } from '../../../utils/deviceUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';

// TODO добавить отображение в ежедневных задачах

const SHEET_ID = ACTIVITY_IDS.IMAGINE_SUCCESS;

const ImagineSuccess: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [goal, setGoal] = useState('');
  const [advantages, setAdvantages] = useState<Array<{ id: string; text: string }>>([]);
  const [newAdvantage, setNewAdvantage] = useState('');
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isAddingNewGoal, setIsAddingNewGoal] = useState(false);

  // Получаем все записи из прогресса, включая записи из прошлых дней
  const records = useMemo(() => {
    // Собираем все записи из всех дней
    let allRecords: ImagineSuccessRecord[] = [];
    
    // Проходим по всем дням в прогрессе
    Object.values(dailyProgress).forEach(dayProgress => {
      const exercise = dayProgress?.exercises.exercises.find(
        (ex: Exercise): ex is ImagineSuccessExercise =>
          ex.type === ACTIVITY_IDS.IMAGINE_SUCCESS && ex.id === SHEET_ID
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

  // Активируем последнюю цель после загрузки страницы
  useEffect(() => {
    if (records.length > 0 && !currentRecordId) {
      // Выбираем самую последнюю запись
      const latestRecord = records[0];
      selectRecord(latestRecord);
    }
  }, [records]); // eslint-disable-line react-hooks/exhaustive-deps

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: ImagineSuccessRecord[]) => {
    const exercise: ImagineSuccessExercise = {
      ...createBaseExercise(SHEET_ID),
      records: updatedRecords
    };

    dispatch(addExercise({ 
      exercise,
      showNotification: false
    }));
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
      timestamp: getCurrentISOTimestamp()
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
      timestamp: getCurrentISOTimestamp()
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
      timestamp: getCurrentISOTimestamp()
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
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
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
