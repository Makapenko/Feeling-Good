import { useState, useMemo } from 'react';
import styles from './PleasureSheet.module.css';
import { Activity } from './types';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { getCurrentISOTimestamp, formatDate, compareDatesDesc } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID = ACTIVITY_IDS.PLEASURE_SHEET;
const SAME = 'same'
const BETTER = 'better'
const WORSE = 'worse'

// TODO Сравнить с другими компонентами используещие range

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
      <div className={`${styles.ratingValue} ${styles[getComparisonClass()]}`}>{value ?? '-'}%</div>
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

const PleasureSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    date: '',
    text: '',
    participants: '',
    expectedPleasure: 0
  });

  // Получаем все записи из прогресса
  const allActivities = useMemo(() => {
    if (!progress?.dailyProgress) return [];

    return getAllRecordsFromProgress<Activity & { date: string }>(
      progress.dailyProgress,
      ACTIVITY_IDS.PLEASURE_SHEET,
      SHEET_ID
    ).sort((a, b) => compareDatesDesc(a.timestamp, b.timestamp));
  }, [progress]);

  const saveToProgress = (updatedActivities: Activity[]) => {
    dispatch(addExercise({
      exercise: {
        ...createBaseExercise(SHEET_ID),
        records: updatedActivities.map(activity => ({
          ...activity,
          timestamp: getCurrentISOTimestamp()
        }))
      },
      showNotification: false
    }));
  };

  const handleAddActivity = () => {
    if (!newActivity.text.trim() || !newActivity.date) return;

    const activity: Activity = {
      id: uuidv4(),
      ...newActivity,
      actualPleasure: null,
      completed: false,
      timestamp: getCurrentISOTimestamp()
    };

    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    setNewActivity({
      date: '',
      text: '',
      participants: '',
      expectedPleasure: 0
    });
    saveToProgress(updatedActivities);
  };

  const handleActivityChange = (
    activityId: string,
    field: 'actualPleasure',
    value: number
  ) => {
    const updatedActivities = activities.map(activity =>
      activity.id === activityId ? { ...activity, [field]: value } : activity
    );
    setActivities(updatedActivities);
    saveToProgress(updatedActivities);
  };

  const handleCompleteActivity = (activityId: string) => {
    const updatedActivities = activities.map(activity =>
      activity.id === activityId ? { ...activity, completed: true } : activity
    );
    setActivities(updatedActivities);
    saveToProgress(updatedActivities);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== activityId);
    setActivities(updatedActivities);
    saveToProgress(updatedActivities);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Листок предполагаемого удовольствия</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div className={styles.description}>
        <p>
          Запишите занятие, вызывающее удовлетворенность, с кем вы это делали и оцените
          предполагаемый уровень удовольствия перед занятием. После занятия запишите реальный
          уровень удовольствия.
        </p>
      </div>

      <div className={styles.addActivity}>
        <div className={styles.inputGroup}>
          <label>
            Дата:
            <input
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              className={styles.dateInput}
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newActivity.text}
            onChange={(e) => setNewActivity({ ...newActivity, text: e.target.value })}
            placeholder="Занятие..."
            className={styles.textInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newActivity.participants}
            onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
            placeholder="С кем? (если в одиночку, укажите «Я»)"
            className={styles.textInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.ratingLabel}>
            Предполагаемый уровень:
            <RatingInput
              value={newActivity.expectedPleasure}
              onChange={(value) => setNewActivity({ ...newActivity, expectedPleasure: value })}
            />
          </label>
        </div>
        <button onClick={handleAddActivity} className={styles.addButton}>
          Добавить
        </button>
      </div>

      <div className={styles.activityList}>
        <div className={styles.headers}>
          <div>Дата</div>
          <div>Занятие</div>
          <div>С кем</div>
          <div>Предполагаемый уровень</div>
          <div>Реальный уровень</div>
          <div></div>
        </div>

        {activities.map(activity => (
          <div key={activity.id} className={styles.activityRow}>
            <div data-label="Дата">{formatDate(activity.date)}</div>
            <div data-label="Занятие">{activity.text}</div>
            <div data-label="С кем">{activity.participants}</div>
            <div className={styles.ratingCell}>
              <RatingInput
                value={activity.expectedPleasure}
                onChange={() => { }}
                disabled={activity.completed}
              />
            </div>
            <div className={styles.ratingCell}>
              {!activity.completed ? (
                <div className={styles.completeButtonContainer}>
                  <button
                    onClick={() => handleCompleteActivity(activity.id)}
                    className={styles.completeButton}
                  >
                    Выполнено
                  </button>
                </div>
              ) : (
                <RatingInput
                  value={activity.actualPleasure}
                  onChange={(value) => handleActivityChange(activity.id, 'actualPleasure', value)}
                  isActual
                  compareValue={activity.expectedPleasure}
                />
              )}
            </div>
            <button
              onClick={() => handleDeleteActivity(activity.id)}
              className={styles.deleteButton}
              aria-label="Удалить занятие"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {allActivities.length > 0 && (
        <div className={styles.historicalActivities}>
          <h3>История занятий</h3>
          <div className={styles.activityList}>
            <div className={styles.headers}>
              <div>Дата</div>
              <div>Занятие</div>
              <div>С кем</div>
              <div>Предполагаемый уровень</div>
              <div>Реальный уровень</div>
            </div>

            {allActivities.map(activity => (
              <div key={activity.id} className={styles.activityRow}>
                <div data-label="Дата">{formatDate(activity.timestamp)}</div>
                <div data-label="Занятие">{activity.text}</div>
                <div data-label="С кем">{activity.participants}</div>
                <div className={styles.ratingCell}>
                  <HistoricalRating value={activity.expectedPleasure} />
                </div>
                <div className={styles.ratingCell}>
                  <HistoricalRating
                    value={activity.actualPleasure}
                    compareValue={activity.expectedPleasure}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.analysis}>
            <h3>Анализ всех занятий</h3>
            <div className={styles.stats}>
              <div>
                <strong>Средняя разница в удовольствии: </strong>
                {Math.round(allActivities
                  .filter(a => a.actualPleasure !== null)
                  .reduce((acc, a) => acc + (a.actualPleasure! - a.expectedPleasure), 0) /
                  allActivities.filter(a => a.actualPleasure !== null).length || 0)}%
              </div>
              <div>
                <strong>Среднее удовольствие: </strong>
                {Math.round(allActivities
                  .filter(a => a.actualPleasure !== null)
                  .reduce((acc, a) => acc + a.actualPleasure!, 0) /
                  allActivities.filter(a => a.actualPleasure !== null).length || 0)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PleasureSheet; 
