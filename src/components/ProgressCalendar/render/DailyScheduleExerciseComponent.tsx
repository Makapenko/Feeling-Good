import React from 'react';
import { DailyScheduleExercise } from '../../Activities/DailySchedule/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface DailyScheduleExerciseProps {
  exercise: DailyScheduleExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const DailyScheduleExerciseComponent: React.FC<DailyScheduleExerciseProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise,
  onClose
}) => {
  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      <div className={styles.scheduleTable}>
        <div className={styles.scheduleHeaders}>
          <div className={styles.timeHeader}>Время</div>
          <div className={styles.columnHeader}>План</div>
          <div className={styles.columnHeader}>Факт</div>
        </div>
        {exercise.timeSlots.map((slot, index) => (
          <div key={index} className={styles.scheduleRow}>
            <div className={styles.timeCell}>{slot.time}</div>
            <div className={styles.activityCell}>
              {slot.planned && (
                <div className={styles.activity}>
                  <p>{slot.planned.text}</p>
                  <div className={styles.ratings}>
                    {slot.planned.type.isTask && (
                      <span className={styles.rating}>⚡ {slot.planned.ratings.task}</span>
                    )}
                    {slot.planned.type.isPleasure && (
                      <span className={styles.rating}>😊 {slot.planned.ratings.pleasure}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.activityCell}>
              {slot.actual && (
                <div className={styles.activity}>
                  <p>{slot.actual.text}</p>
                  <div className={styles.ratings}>
                    {slot.actual.type.isTask && (
                      <span className={styles.rating}>⚡ {slot.actual.ratings.task}</span>
                    )}
                    {slot.actual.type.isPleasure && (
                      <span className={styles.rating}>😊 {slot.actual.ratings.pleasure}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default DailyScheduleExerciseComponent;
