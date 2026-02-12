import {
  formatDateWithOptions
} from '../../utils/dateUtils';
import styles from './TodayTasks.module.css';

interface TestTask {
  id: string;
  testId: string;
  title: string;
  message: string;
  needToComplete: boolean;
  lastScore: number | null;
  scorePercent: number | null;
  completedAt: string | null;
  buttonText: string;
}

// Компонент для отображения тестовых заданий
const TestTaskComponent: React.FC<{ 
  task: TestTask,
  onActivityClick: (activityId: string) => void
}> = ({ task, onActivityClick }) => {
  return (
    <div
      className={`${styles.task} ${task.needToComplete ? styles.clickable : ''}`}
      onClick={task.needToComplete ? () => onActivityClick(task.id) : undefined}
    >
      <div className={styles.taskHeader}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={!task.needToComplete}
            readOnly
          />
        </div>
        <span className={styles.taskTitle}>
          {task.message}
        </span>
      </div>
      
      <div className={styles.taskProgress}>
        {/* Показываем информацию о последнем результате, если он есть */}
        {task.lastScore !== null && (
          <div className={styles.testResultContainer}>
            <div className={styles.testScoreInfo}>
              <span className={styles.testScoreLabel}>Последний результат: </span>
              <span className={styles.testScoreValue}>
                {task.lastScore} баллов
                {task.scorePercent !== null && ` (${task.scorePercent}%)`}
              </span>
              <span className={styles.testScoreDate}>
              &#32;{formatDateWithOptions(task.completedAt || '')}
              </span>
            </div>
          </div>
        )}
        
        {/* Показываем кнопку прохождения, если нужно */}
        {task.needToComplete && (
          <span 
            className={styles.openLink}
            onClick={(e) => {
              e.stopPropagation();
              onActivityClick(task.id);
            }}
          >
            {task.buttonText}
          </span>
        )}
        
        {!task.needToComplete && (
          <span className={styles.timeSpent}>
            {task.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default TestTaskComponent;
