import { memo } from 'react';
import styles from './DailySchedule.module.css';
import { Activity } from './types';

interface ActivityColumnProps {
  activity: Activity | null;
  onActivityChange: (text: string) => void;
  onTypeToggle: (type: 'task' | 'pleasure') => void;
  onRatingChange: (type: 'task' | 'pleasure', value: number) => void;
}

const ActivityColumn = memo(({ 
  activity, 
  onActivityChange, 
  onTypeToggle, 
  onRatingChange 
}: ActivityColumnProps) => (
  <div className={styles.activityContainer}>
    <input
      type="text"
      value={activity?.text || ''}
      onChange={(e) => onActivityChange(e.target.value)}
      placeholder="Введите занятие..."
      className={styles.activityInput}
    />
    {activity?.text && (
      <div className={styles.ratings}>
        <div className={styles.ratingGroup}>
          <label>
            <input
              type="checkbox"
              checked={activity.type.isTask}
              onChange={() => onTypeToggle('task')}
            />
            ⚡
          </label>
          {activity.type.isTask && (
            <select
              value={activity.ratings.task || ''}
              onChange={(e) => onRatingChange('task', Number(e.target.value))}
            >
              <option value="">-</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.ratingGroup}>
          <label>
            <input
              type="checkbox"
              checked={activity.type.isPleasure}
              onChange={() => onTypeToggle('pleasure')}
            />
            😊
          </label>
          {activity.type.isPleasure && (
            <select
              value={activity.ratings.pleasure || ''}
              onChange={(e) => onRatingChange('pleasure', Number(e.target.value))}
            >
              <option value="">-</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    )}
  </div>
));

ActivityColumn.displayName = 'ActivityColumn';

export default ActivityColumn; 
