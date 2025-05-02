import styles from './TodayTasks.module.css';
import {
  formatTimeFromSeconds
} from '../../utils/dateUtils';

// Интерфейс для задания с методиками
export interface MethodsTask {
  id: string;
  title: string;
  description: string;
  goalSeconds: number;
  methodIds: { id: string, name: string }[];
  totalTime: number;
}

// Компонент для отображения заданий с методиками
const MethodsTaskComponent: React.FC<{ 
  task: MethodsTask,
  onActivityClick: (activityId: string) => void
}> = ({ task, onActivityClick }) => {
  const goalAchieved = task.totalTime >= task.goalSeconds;
  
  return (
    <div 
      className={`${styles.task} ${!goalAchieved ? styles.clickable : ''}`}
      onClick={!goalAchieved ? () => onActivityClick(task.methodIds[0].id) : undefined}
    >
      <div className={styles.taskHeader}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={goalAchieved}
            readOnly
          />
        </div>
        <span className={styles.taskTitle}>
          {task.description}
        </span>
      </div>
      <div className={styles.taskProgress}>
        <span className={styles.timeSpent}>
          Время работы: {formatTimeFromSeconds(task.totalTime)}
        </span>
        {!goalAchieved && (
          <>
            <span className={styles.remainingTime}>
              Осталось: {formatTimeFromSeconds(task.goalSeconds - task.totalTime)}
            </span>
            <div className={styles.methodLinks}>
              {task.methodIds.map(method => (
                <span
                  key={method.id}
                  className={styles.openLink}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivityClick(method.id);
                  }}
                >
                  Открыть {method.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MethodsTaskComponent;
