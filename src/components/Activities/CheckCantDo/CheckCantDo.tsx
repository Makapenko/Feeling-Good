import React, { useState, useMemo } from 'react';
import styles from './CheckCantDo.module.css';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { CheckCantDoRecord, CheckCantDoExercise } from './types';
import { Exercise } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getCurrentISOTimestamp, formatDateWithOptions } from '../../../utils/dateUtils';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { useIsMobile } from '../../../utils/deviceUtils';
import { compareDatesDesc } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const SHEET_ID = ACTIVITY_IDS.CHECK_CANT_DO;

const CheckCantDo: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();

  const [newTask, setNewTask] = useState('');
  const [minimumDescription, setMinimumDescription] = useState('');
  const isMobile = useIsMobile();

  // Получаем все записи из прогресса
  const records = useMemo(() => {
    const currentDate = getCurrentDate();
    const dayProgress = dailyProgress[currentDate];
    const exercise = dayProgress?.exercises.exercises.find(
      (ex: Exercise): ex is CheckCantDoExercise =>
        ex.type === SHEET_ID && ex.id === SHEET_ID
    );
    return exercise?.records || [];
  }, [dailyProgress]);

  // Сохраняем обновленные записи в прогресс
  const saveToProgress = (updatedRecords: CheckCantDoRecord[]) => {
    const exercise: CheckCantDoExercise = {
      ...createBaseExercise(SHEET_ID),
      records: updatedRecords
    };

    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  const addTask = () => {
    if (!newTask.trim() || !minimumDescription.trim()) return;

    const newRecord: CheckCantDoRecord = {
      id: uuidv4(),
      text: newTask.trim(),
      minimumDone: false,
      minimumDescription: minimumDescription.trim(),
      timestamp: getCurrentISOTimestamp()
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
    return [...records].sort((a, b) => compareDatesDesc(a.timestamp, b.timestamp));
  }, [records]);


  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Проверяйте свои «не могу»</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
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
                    {formatDateWithOptions(task.timestamp, {
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
                    <span className={styles.checkmark}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
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
