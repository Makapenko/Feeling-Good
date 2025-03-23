import React, { useState, useMemo, useEffect } from 'react';
import styles from './CheckCantDo.module.css';
import { useProgress } from '../../../store/ProgressContext';
import { CheckCantDoRecord, CheckCantDoExercise, Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../../../utils/dateUtils';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';

const SHEET_ID = ACTIVITY_IDS.CHECK_CANT_DO;

const CheckCantDo: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const [newTask, setNewTask] = useState('');
  const [minimumDescription, setMinimumDescription] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Получаем статус избранного из Redux
  const isFavorite = useMemo(() => {
    return progress.favoriteActivities?.includes(SHEET_ID) || false;
  }, [progress.favoriteActivities]);

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
      (ex: Exercise): ex is CheckCantDoExercise => 
        ex.type === ACTIVITY_IDS.CHECK_CANT_DO && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [progress.dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: CheckCantDoRecord[]) => {
    const exercise: CheckCantDoExercise = {
      type: ACTIVITY_IDS.CHECK_CANT_DO,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.CHECK_CANT_DO],
      completed: false,
      completedAt: '',
      records: updatedRecords
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  const addTask = () => {
    if (!newTask.trim() || !minimumDescription.trim()) return;
    
    const newRecord: CheckCantDoRecord = {
      id: uuidv4(),
      text: newTask.trim(),
      minimumDone: false,
      minimumDescription: minimumDescription.trim(),
      timestamp: new Date().toISOString()
    };
    
    saveToProgress([...records, newRecord]);
    setNewTask('');
    setMinimumDescription('');
  };

  const removeTask = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    saveToProgress(updatedRecords);
  };

  const toggleMinimumDone = (id: string) => {
    const updatedRecords = records.map(record => 
      record.id === id 
        ? { ...record, minimumDone: !record.minimumDone }
        : record
    );
    saveToProgress(updatedRecords);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Сортируем записи по времени создания (новые сверху)
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [records]);

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
        <h2>Проверяйте свои «не могу»</h2>
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
          Этот метод помогает преодолеть негативное мышление, связанное с убеждением "я не могу". 
          Вместо того чтобы принимать эти мысли как факт, мы проверяем их с помощью простых экспериментов.
        </p>
        <div className={styles.example}>
          <h4>Пример:</h4>
          <p>
            Если вы думаете "Я не могу читать, потому что не могу сосредоточиться" — 
            попробуйте прочитать всего одно предложение и пересказать его смысл.
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Список ваших "не могу"</h3>
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label>Что вы "не можете" сделать:</label>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isMobile ? "Ваше «не могу»" : "Например: Я не могу читать..."}
              className={styles.input}
              aria-label="Что вы не можете сделать"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Минимальный шаг для проверки:</label>
            <input
              type="text"
              value={minimumDescription}
              onChange={(e) => setMinimumDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isMobile ? "Минимальный шаг" : "Например: Прочитать одно предложение..."}
              className={styles.input}
              aria-label="Минимальный шаг для проверки"
            />
          </div>
          <button 
            onClick={addTask} 
            className={styles.addButton}
            disabled={!newTask.trim() || !minimumDescription.trim()}
          >
            Добавить
          </button>
        </div>

        <div className={styles.tasksList}>
          {sortedRecords.length > 0 ? (
            sortedRecords.map((task) => (
              <div key={task.id} className={styles.taskItem} data-id={task.id}>
                <div className={styles.taskContent}>
                  <div className={styles.taskHeader}>
                    <h4>Убеждение "не могу":</h4>
                    <span className={styles.taskText}>{task.text}</span>
                  </div>
                  <div className={styles.taskMinimum}>
                    <h4>Минимальный шаг:</h4>
                    <span className={styles.minimumText}>{task.minimumDescription}</span>
                  </div>
                  <div className={styles.taskTime}>
                    {new Date(task.timestamp).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={styles.taskActions}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={task.minimumDone}
                      onChange={() => toggleMinimumDone(task.id)}
                    />
                    <span className={styles.checkmark}></span>
                    <span className={styles.checkboxLabel}>
                      {task.minimumDone ? 'Минимум выполнен!' : 'Минимум не проверен'}
                    </span>
                  </label>
                  <button
                    onClick={() => removeTask(task.id)}
                    className={styles.removeButton}
                    aria-label="Удалить задание"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.placeholder}>
              Добавьте ваше первое "не могу" для проверки
            </p>
          )}
        </div>
      </div>

      <div className={styles.motivation}>
        <p>
          Помните: часто наши "не могу" — это всего лишь предположения, 
          которые можно и нужно проверять. Начните с самого малого, 
          и вы увидите, что способны на гораздо большее!
        </p>
      </div>
    </div>
  );
};

export default CheckCantDo; 
