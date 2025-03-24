import { useState, useCallback, useEffect } from 'react';
import styles from './DailySchedule.module.css';
import { TimeSlot } from './types';
import ActivityColumn from './ActivityColumn';
import { useProgress } from '../../../store/ProgressContext';
import { DailyScheduleExercise } from '../../../types/progress.types';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
const SHEET_ID = ACTIVITY_IDS.DAILY_SCHEDULE;

const DailySchedule = () => {
  const { progress, dispatch } = useProgress();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: '8:00-9:00', planned: null, actual: null },
    { time: '9:00-10:00', planned: null, actual: null },
    { time: '10:00-11:00', planned: null, actual: null },
    { time: '11:00-12:00', planned: null, actual: null },
    { time: '12:00-13:00', planned: null, actual: null },
    { time: '13:00-14:00', planned: null, actual: null },
    { time: '14:00-15:00', planned: null, actual: null },
    { time: '15:00-16:00', planned: null, actual: null },
    { time: '16:00-17:00', planned: null, actual: null },
    { time: '17:00-18:00', planned: null, actual: null },
    { time: '18:00-19:00', planned: null, actual: null },
    { time: '19:00-20:00', planned: null, actual: null },
    { time: '20:00-21:00', planned: null, actual: null },
    { time: '21:00-22:00', planned: null, actual: null },
    { time: '22:00-23:00', planned: null, actual: null },
  ]);

  // Загрузка расписания при изменении даты
  useEffect(() => {
    if (!date || !progress?.dailyProgress) return;

    const dayProgress = progress.dailyProgress[date];
    if (!dayProgress?.exercises.exercises) {
      // Сброс к пустому расписанию
      setTimeSlots(prevSlots => prevSlots.map(slot => ({
        time: slot.time,
        planned: null,
        actual: null
      })));
      return;
    }
    const schedule = dayProgress.exercises.exercises.find(
      exercise => exercise.type === ACTIVITY_IDS.DAILY_SCHEDULE && exercise.id === SHEET_ID
    ) as DailyScheduleExercise | undefined;


    if (schedule?.timeSlots) {
      setTimeSlots(schedule.timeSlots);
    } else {
      setTimeSlots(prevSlots => prevSlots.map(slot => ({
        time: slot.time,
        planned: null,
        actual: null
      })));
    }
  }, [date, progress?.dailyProgress]);

  // Сохранение расписания при изменении
  const saveSchedule = useCallback(() => {
    if (!date) return;
    const exercise: DailyScheduleExercise = {
      type: ACTIVITY_IDS.DAILY_SCHEDULE,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.DAILY_SCHEDULE],
      completed: true,
      completedAt: new Date().toISOString(),
      date: date, // Используем выбранную дату
      timeSlots
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  }, [dispatch, date, timeSlots]);

  // Автоматическое сохранение при изменении timeSlots
  useEffect(() => {
    const hasActivities = timeSlots.some(slot => slot.planned?.text || slot.actual?.text);

    if (date && hasActivities) {
      const timeoutId = setTimeout(() => {
        saveSchedule();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [timeSlots, saveSchedule, date]);

  const handleActivityChange = useCallback((index: number, text: string, type: 'planned' | 'actual') => {

    setTimeSlots(prevSlots => {
      const newTimeSlots = [...prevSlots];
      if (!newTimeSlots[index][type]) {
        newTimeSlots[index][type] = {
          text,
          type: { isTask: false, isPleasure: false },
          ratings: { task: null, pleasure: null }
        };
      } else {
        newTimeSlots[index][type].text = text;
      }
      return newTimeSlots;
    });
  }, []);

  const toggleActivityType = useCallback((index: number, activityType: 'task' | 'pleasure', columnType: 'planned' | 'actual') => {
    setTimeSlots(prevSlots => {
      const newTimeSlots = prevSlots.map((slot, i) => {
        if (i !== index) return slot;

        const activity = slot[columnType];
        if (!activity) return slot;

        return {
          ...slot,
          [columnType]: {
            ...activity,
            type: {
              ...activity.type,
              [activityType === 'task' ? 'isTask' : 'isPleasure']: !activity.type[activityType === 'task' ? 'isTask' : 'isPleasure']
            }
          }
        };
      });
      return newTimeSlots;
    });
  }, []);

  const handleRatingChange = useCallback((
    index: number,
    activityType: 'task' | 'pleasure',
    columnType: 'planned' | 'actual',
    value: number
  ) => {
    setTimeSlots(prevSlots => {
      const newTimeSlots = prevSlots.map((slot, i) => {
        if (i !== index) return slot;

        const activity = slot[columnType];
        if (!activity) return slot;

        return {
          ...slot,
          [columnType]: {
            ...activity,
            ratings: {
              ...activity.ratings,
              [activityType]: value
            }
          }
        };
      });
      return newTimeSlots;
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Расписание дня</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} className={styles.chapterButton} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div className={styles.dateContainer}>
        <label>
          Дата:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
          />
        </label>
      </div>
      <div className={styles.legend}>
        <p>Отметьте каждое занятие:</p>
        <ul>
          <li>⚡ (1-5) - дело (сложность)</li>
          <li>😊 (1-5) - удовольствие (степень)</li>
        </ul>
      </div>
      <div className={styles.schedule}>
        <div className={styles.headers}>
          <div className={styles.timeHeader}>Время</div>
          <div className={styles.columnHeader}>План</div>
          <div className={styles.columnHeader}>Факт</div>
        </div>
        {timeSlots.map((slot, index) => (
          <div key={slot.time} className={styles.timeSlot}>
            <div className={styles.time}>{slot.time}</div>
            <ActivityColumn
              activity={slot.planned}
              onActivityChange={(text) => handleActivityChange(index, text, 'planned')}
              onTypeToggle={(type) => toggleActivityType(index, type, 'planned')}
              onRatingChange={(type, value) => handleRatingChange(index, type, 'planned', value)}
              placeholder="Планируемое занятие"
            />
            <ActivityColumn
              activity={slot.actual}
              onActivityChange={(text) => handleActivityChange(index, text, 'actual')}
              onTypeToggle={(type) => toggleActivityType(index, type, 'actual')}
              onRatingChange={(type, value) => handleRatingChange(index, type, 'actual', value)}
              placeholder="Фактическое занятие"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySchedule; 
