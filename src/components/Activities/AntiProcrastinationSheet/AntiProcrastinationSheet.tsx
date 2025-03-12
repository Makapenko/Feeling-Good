import { useState } from 'react';
import styles from './AntiProcrastinationSheet.module.css';
import { Task } from './types';
import { v4 as uuidv4 } from 'uuid';

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
    
    if (value === compareValue) return 'same';
    if (isReversed) {
      return value < compareValue ? 'better' : 'worse';
    }
    return value > compareValue ? 'better' : 'worse';
  };

  return (
    <div className={styles.ratingInputContainer}>
      <div className={styles.ratingValue}>{value ?? '-'}%</div>
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

const AntiProcrastinationSheet = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

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

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const handleRatingChange = (
    taskId: string,
    field: 'expectedDifficulty' | 'expectedPleasure' | 'actualDifficulty' | 'actualPleasure',
    value: number
  ) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className={styles.container}>
      <h2>Листок антипрокрастинации</h2>
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
                <div className={styles.completeButtonContainer}>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className={styles.completeButton}
                  >
                    Выполнил
                  </button>
                </div>
              ) : (
                <>
                  <RatingInput
                    value={task.actualDifficulty}
                    onChange={(value) => handleRatingChange(task.id, 'actualDifficulty', value)}
                    isActual
                    compareValue={task.expectedDifficulty}
                    isReversed={true}
                  />
                  <RatingInput
                    value={task.actualPleasure}
                    onChange={(value) => handleRatingChange(task.id, 'actualPleasure', value)}
                    isActual
                    compareValue={task.expectedPleasure}
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

      {tasks.length > 0 && (
        <div className={styles.analysis}>
          <h3>Анализ выполненных задач</h3>
          <div className={styles.stats}>
            {(() => {
              const difficultyDiff = Math.round(tasks
                .filter(t => t.actualDifficulty !== null)
                .reduce((acc, t) => acc + (t.actualDifficulty! - t.expectedDifficulty), 0) / 
                tasks.filter(t => t.actualDifficulty !== null).length || 0);

              const pleasureDiff = Math.round(tasks
                .filter(t => t.actualPleasure !== null)
                .reduce((acc, t) => acc + (t.actualPleasure! - t.expectedPleasure), 0) / 
                tasks.filter(t => t.actualPleasure !== null).length || 0);

              const getDiffClass = (diff: number, isReversed = false) => {
                if (diff === 0) return 'same';
                if (isReversed) {
                  return diff < 0 ? 'better' : 'worse';
                }
                return diff > 0 ? 'better' : 'worse';
              };

              return (
                <>
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AntiProcrastinationSheet; 
