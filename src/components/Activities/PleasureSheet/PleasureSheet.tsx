import { useState, useMemo } from 'react';
import styles from './PleasureSheet.module.css';
import { Activity } from './types';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { getCurrentISOTimestamp, formatDate, compareDatesDesc, getCurrentDate } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID = ACTIVITY_IDS.PLEASURE_SHEET;
const SAME = 'same'
const BETTER = 'better'
const WORSE = 'worse'

// TODO Сравнить с другими компонентами используещие range

// TODO Поправить заголовки таблицы

/**
 * Рассчитывает среднюю разницу между фактическим и ожидаемым удовольствием
 */
const calculateAveragePleasureDifference = (activities: Activity[]): number => {
  const completedActivities = activities.filter(a => a.actualPleasure !== null);
  if (completedActivities.length === 0) return 0;
  
  return Math.round(
    completedActivities.reduce((acc, a) => acc + (a.actualPleasure! - a.expectedPleasure), 0) / 
    completedActivities.length
  );
};

/**
 * Рассчитывает среднее фактическое удовольствие от всех занятий
 */
const calculateAveragePleasure = (activities: Activity[]): number => {
  const completedActivities = activities.filter(a => a.actualPleasure !== null);
  if (completedActivities.length === 0) return 0;
  
  return Math.round(
    completedActivities.reduce((acc, a) => acc + a.actualPleasure!, 0) / 
    completedActivities.length
  );
};

/**
 * Компонент для отображения или ввода рейтинга
 */
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

/**
 * Компонент для отображения исторического рейтинга
 */
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

/**
 * Компонент для отображения анализа активностей
 */
const ActivityAnalysis: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  const averageDifference = calculateAveragePleasureDifference(activities);
  const averagePleasure = calculateAveragePleasure(activities);
  
  return (
    <div className={styles.analysis}>
      <h3>Анализ всех занятий</h3>
      <div className={styles.stats}>
        <div>
          <strong>Средняя разница в удовольствии: </strong>
          {averageDifference}%
        </div>
        <div>
          <strong>Среднее удовольствие: </strong>
          {averagePleasure}%
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент для отображения истории активностей
 */
const HistoricalActivitiesList: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  // Фильтруем только завершенные активности для истории
  const completedActivities = activities.filter(activity => activity.completed);
  
  if (completedActivities.length === 0) return null;
  
  return (
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

        {completedActivities.map(activity => (
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
      
      <ActivityAnalysis activities={completedActivities} />
    </div>
  );
};

/**
 * Компонент формы добавления новой активности
 */
const AddActivityForm: React.FC<{
  newActivity: {
    date: string;
    text: string;
    participants: string;
    expectedPleasure: number;
  };
  setNewActivity: React.Dispatch<React.SetStateAction<{
    date: string;
    text: string;
    participants: string;
    expectedPleasure: number;
  }>>;
  onAddActivity: () => void;
}> = ({ newActivity, setNewActivity, onAddActivity }) => {
  return (
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
      <button onClick={onAddActivity} className={styles.addButton}>
        Добавить
      </button>
    </div>
  );
};

/**
 * Компонент для отображения списка текущих активностей
 */
const ActivityList: React.FC<{
  activities: Activity[];
  onActivityChange: (activityId: string, field: 'actualPleasure', value: number) => void;
  onCompleteActivity: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
}> = ({ activities, onActivityChange, onCompleteActivity, onDeleteActivity }) => {
  // Состояние для отслеживания ID активности в режиме редактирования
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  
  const startEditing = (activityId: string) => {
    setEditingActivityId(activityId);
  };
  
  const finishEditing = (activityId: string) => {
    setEditingActivityId(null);
    onCompleteActivity(activityId);
  };
  
  return (
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
              disabled={true}
            />
          </div>
          <div className={styles.ratingCell}>
            {editingActivityId !== activity.id ? (
              <div className={styles.completeButtonContainer}>
                <button
                  onClick={() => startEditing(activity.id)}
                  className={styles.completeButton}
                >
                  Выполнено
                </button>
              </div>
            ) : (
              <>
                <RatingInput
                  value={activity.actualPleasure !== null ? activity.actualPleasure : activity.expectedPleasure}
                  onChange={(value) => onActivityChange(activity.id, 'actualPleasure', value)}
                  isActual
                  compareValue={activity.expectedPleasure}
                  placeholder="Укажите реальное удовольствие"
                />
                <button
                  onClick={() => finishEditing(activity.id)}
                  className={styles.saveButton}
                >
                  Сохранить в историю
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => onDeleteActivity(activity.id)}
            className={styles.deleteButton}
            aria-label="Удалить занятие"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

const PleasureSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  
  // Используем функцию из dateUtils
  const today = getCurrentDate();
  
  const [newActivity, setNewActivity] = useState({
    date: today,
    text: '',
    participants: '',
    expectedPleasure: 0
  });

  // Получаем все записи из прогресса и устанавливаем их в локальное состояние
  const activities = useMemo(() => {
    if (!progress?.dailyProgress) return [];

    const allRecords = getAllRecordsFromProgress<Activity>(
      progress.dailyProgress,
      SHEET_ID,
      SHEET_ID
    );
    
    return allRecords.sort((a, b) => 
      // Сначала не завершенные активности
      a.completed === b.completed 
        ? compareDatesDesc(a.timestamp, b.timestamp) 
        : (a.completed ? 1 : -1) - (b.completed ? 1 : -1)
    );
  }, [progress]);

  // Фильтруем активности для текущего списка и истории
  const currentActivities = useMemo(() => 
    activities.filter(activity => !activity.completed), 
    [activities]
  );
  
  const historicalActivities = useMemo(() => 
    activities.filter(activity => activity.completed), 
    [activities]
  );

  const saveToProgress = (updatedActivity: Activity) => {
    // Находим индекс активности для обновления или -1 для новой
    const activityIndex = activities.findIndex(a => a.id === updatedActivity.id);
    
    // Создаем новый массив с обновленной/добавленной активностью
    let updatedActivities;
    if (activityIndex >= 0) {
      // Обновляем существующую активность
      updatedActivities = [...activities];
      updatedActivities[activityIndex] = updatedActivity;
    } else {
      // Добавляем новую активность
      updatedActivities = [...activities, updatedActivity];
    }
    
    dispatch(addExercise({
      exercise: {
        ...createBaseExercise(SHEET_ID),
        records: updatedActivities
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

    saveToProgress(activity);
    setNewActivity({
      date: today,
      text: '',
      participants: '',
      expectedPleasure: 0
    });
  };

  const handleActivityChange = (
    activityId: string,
    field: 'actualPleasure',
    value: number
  ) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    // Обновляем только поле actualPleasure, не меняя статус completed
    const updatedActivity = { ...activity, [field]: value };
    saveToProgress(updatedActivity);
  };

  const handleCompleteActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    // При сохранении задаем actualPleasure (если еще не задано) и устанавливаем completed в true
    const actualPleasure = activity.actualPleasure !== null 
      ? activity.actualPleasure 
      : activity.expectedPleasure;
    
    const updatedActivity = { 
      ...activity, 
      actualPleasure: actualPleasure,
      completed: true 
    };
    
    saveToProgress(updatedActivity);
  };

  const handleDeleteActivity = (activityId: string) => {
    // Находим все активности кроме удаляемой
    const filteredActivities = activities.filter(a => a.id !== activityId);
    
    dispatch(addExercise({
      exercise: {
        ...createBaseExercise(SHEET_ID),
        records: filteredActivities
      },
      showNotification: false
    }));
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

      <AddActivityForm
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        onAddActivity={handleAddActivity}
      />

      <ActivityList
        activities={currentActivities}
        onActivityChange={handleActivityChange}
        onCompleteActivity={handleCompleteActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      <HistoricalActivitiesList activities={historicalActivities} />
    </div>
  );
};

export default PleasureSheet; 
