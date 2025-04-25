import { useState, useMemo, useEffect } from 'react';
import styles from './AntiProcrastinationSheet.module.css';
import { Task } from './types';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { getCurrentDate, getCurrentISOTimestamp } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID = ACTIVITY_IDS.ANTI_PROCRASTINATION;

//TODO Поправить вёрстку заголовков в таблице (на средних разрешениях)

const SAME = 'same'
const BETTER = 'better'
const WORSE = 'worse'

const RatingInput = ({
  value,
  onChange,
  placeholder = '',
  isActual = false,
  disabled = false,
  compareValue = null,
  isReversed = false
}: {
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  isActual?: boolean;
  disabled?: boolean;
  compareValue?: number | null;
  isReversed?: boolean;
}) => {
  const getComparisonClass = () => {
    if (!isActual || value === null || compareValue === null) return '';

    if (value === compareValue) return SAME;
    if (isReversed) {
      return value < compareValue ? BETTER : WORSE;
    }
    return value > compareValue ? BETTER : WORSE;
  };

  return (
    <div className={styles.ratingInputContainer}>
      <div className={styles.ratingValue}>{value ?? 0}%</div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${styles.ratingInput} ${isActual ? styles.actualRating : ''} ${styles[getComparisonClass()]}`}
        disabled={disabled}
      />
      {isActual && value === null && (
        <div className={styles.placeholder}>{placeholder}</div>
      )}
    </div>
  );
};

const HistoricalRating = ({
  value,
  compareValue = null,
  isReversed = false
}: {
  value: number | null;
  compareValue?: number | null;
  isReversed?: boolean;
}) => {
  const getComparisonClass = () => {
    if (value === null || compareValue === null) return '';

    if (value === compareValue) return SAME;
    if (isReversed) {
      return value < compareValue ? BETTER : WORSE;
    }
    return value > compareValue ? BETTER : WORSE;
  };

  return (
    <div className={styles.historicalRating}>
      <span className={styles[getComparisonClass()]}>
        {value ?? '-'}%
      </span>
    </div>
  );
};

const TaskAnalysis = ({ tasks, title = "Анализ выполненных задач" }: { tasks: Task[]; title?: string }) => {
  const difficultyDiff = Math.round(tasks
    .filter(t => t.actualDifficulty !== null)
    .reduce((acc, t) => acc + (t.actualDifficulty! - t.expectedDifficulty), 0) /
    tasks.filter(t => t.actualDifficulty !== null).length || 0);

  const pleasureDiff = Math.round(tasks
    .filter(t => t.actualPleasure !== null)
    .reduce((acc, t) => acc + (t.actualPleasure! - t.expectedPleasure), 0) /
    tasks.filter(t => t.actualPleasure !== null).length || 0);

  const getDiffClass = (diff: number, isReversed = false) => {
    if (diff === 0) return SAME;
    if (isReversed) {
      return diff < 0 ? BETTER : WORSE;
    }
    return diff > 0 ? BETTER : WORSE;
  };

  if (tasks.length === 0) return null;

  return (
    <div className={styles.analysis}>
      <h3>{title}</h3>
      <div className={styles.stats}>
        <div>
          <strong>Средняя разница в сложности: </strong>
          <span className={styles[getDiffClass(difficultyDiff, true)]}>
            {difficultyDiff}%
          </span>
        </div>
        <div>
          <strong>Средняя разница в удовольствии: </strong>
          <span className={styles[getDiffClass(pleasureDiff)]}>
            {pleasureDiff}%
          </span>
        </div>
      </div>
    </div>
  );
};

const AntiProcrastinationSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  
  // Получаем начальные задачи из Redux
  const todayTasks = useMemo(() => {
    if (!dailyProgress) return [];
    
    const today = getCurrentDate();
    const todayProgress = dailyProgress[today];
    
    if (!todayProgress?.exercises?.exercises) return [];
    
    const antiProcrastinationExercise = todayProgress.exercises.exercises.find(
      exercise => exercise.type === 'anti-procrastination' && exercise.id === SHEET_ID
    );
    
    if (antiProcrastinationExercise && 'records' in antiProcrastinationExercise) {
      return antiProcrastinationExercise.records as Task[];
    }
    
    return [];
  }, [dailyProgress]);
  const [tasks, setTasks] = useState<Task[]>(todayTasks);
  const [newTask, setNewTask] = useState('');
  
  // Обновляем tasks при изменении данных в Redux
  useEffect(() => {
    if (todayTasks.length > 0) {
      setTasks(todayTasks);
    }
  }, [todayTasks]);

  // Получаем все записи из прогресса, используя новую утилиту
  const allTasks = useMemo(() => {
    // После изменения recordsUtils.ts фильтрация происходит внутри функции
    return getAllRecordsFromProgress<Task>(
      dailyProgress,
      SHEET_ID,
      SHEET_ID
    );
  }, [dailyProgress]);

  const saveToProgress = (updatedTasks: Task[]) => {
    const records = updatedTasks.map(task => ({
      ...task,
      timestamp: getCurrentISOTimestamp() // Это обеспечивает, что timestamp всегда существует
    }));

    // Сразу обновляем локальный state перед отправкой в Redux
    setTasks(updatedTasks);
    
    // Диспатчим действие в Redux
    dispatch(addExercise({
      exercise: {
        ...createBaseExercise(SHEET_ID),
        records
      },
      showNotification: false
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: uuidv4(),
      text: newTask,
      expectedDifficulty: 0,
      expectedPleasure: 0,
      actualDifficulty: null,
      actualPleasure: null,
      completed: false
    };

    const updatedTasks = [...tasks, task];
    setNewTask('');
    saveToProgress(updatedTasks);
  };

  const handleRatingChange = (
    taskId: string,
    field: 'expectedDifficulty' | 'expectedPleasure' | 'actualDifficulty' | 'actualPleasure',
    value: number
  ) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    saveToProgress(updatedTasks);
  };

  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    saveToProgress(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveToProgress(updatedTasks);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Листок антипрокрастинации</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>

      <div className={styles.description}>
        <p>
          Запишите ваш прогноз относительно того, насколько трудной и интересной окажется задача,
          прежде чем вы к ней приступите. После выполнения каждого этапа задачи запишите,
          насколько трудным и интересным он оказался.
        </p> <br />
        <p>Если задача требует существенных затрат времени и усилий, лучше всего разбить ее на несколько небольших этапов, каждый из которых займет не более 15 минут. </p>
      </div>

      <div className={styles.addTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Введите новую задачу..."
          className={styles.taskInput}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button onClick={handleAddTask} className={styles.addButton}>
          Добавить
        </button>
      </div>

      <div className={styles.taskList}>
        <div className={styles.headers}>
          <div className={styles.taskHeader}>Задача</div>
          <div className={styles.ratingHeader}>
            <div>Предполагаемая трудность</div>
            <div>Предполагаемое удовольствие</div>
            <div>Реальная трудность</div>
            <div>Реальное удовольствие</div>
          </div>
          <div className={styles.actionHeader}></div>
        </div>

        {tasks.map(task => (
          <div key={task.id} className={styles.taskRow}>
            <div className={styles.taskText}>{task.text}</div>
            <div className={styles.ratings}>
              <RatingInput
                value={task.expectedDifficulty}
                onChange={(value) => handleRatingChange(task.id, 'expectedDifficulty', value)}
                disabled={task.completed}
              />
              <RatingInput
                value={task.expectedPleasure}
                onChange={(value) => handleRatingChange(task.id, 'expectedPleasure', value)}
                disabled={task.completed}
              />
              {!task.completed ? (
                <>
                  <div className={styles.completeButtonContainer}>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className={styles.completeButton}
                    >
                      Выполнил
                    </button>
                  </div>
                  <div></div>
                </>
              ) : (
                <>
                  <RatingInput
                    value={task.actualDifficulty}
                    onChange={(value) => handleRatingChange(task.id, 'actualDifficulty', value)}
                    isActual
                    compareValue={task.expectedDifficulty}
                    isReversed={true}
                    placeholder="Реальная трудность"
                  />
                  <RatingInput
                    value={task.actualPleasure}
                    onChange={(value) => handleRatingChange(task.id, 'actualPleasure', value)}
                    isActual
                    compareValue={task.expectedPleasure}
                    placeholder="Реальное удовольствие"
                  />
                </>
              )}
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className={styles.deleteButton}
              aria-label="Удалить задачу"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {tasks.length > 0 && <TaskAnalysis tasks={tasks} />}

      {allTasks.length > 0 && (
        <div className={styles.historicalTasks}>
          <h3>История задач</h3>
          <div className={styles.taskList}>
            {allTasks.map(task => (
              <div key={task.id} className={styles.taskRow}>
                <div className={styles.taskDate}>
                  {task.timestamp && new Date(task.timestamp).toLocaleDateString('ru-RU')}
                </div>
                <div className={styles.taskText}>{task.text}</div>
                <div className={styles.ratings}>
                  <HistoricalRating value={task.expectedDifficulty} />
                  <HistoricalRating value={task.expectedPleasure} />
                  <HistoricalRating
                    value={task.actualDifficulty}
                    compareValue={task.expectedDifficulty}
                    isReversed={true}
                  />
                  <HistoricalRating
                    value={task.actualPleasure}
                    compareValue={task.expectedPleasure}
                  />
                </div>
                <div></div>
              </div>
            ))}
          </div>
          <TaskAnalysis tasks={allTasks} title="Анализ всех задач" />
        </div>
      )}
    </div>
  );
}

// Экспортируем компонент явно
export default AntiProcrastinationSheet;
