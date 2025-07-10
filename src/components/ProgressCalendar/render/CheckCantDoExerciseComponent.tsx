import React from 'react';
import {  CheckCantDoExercise } from '../../Activities/CheckCantDo/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { formatTime } from '../../../utils/dateUtils';

interface  CheckCantDoExerciseProps {
  exercise: CheckCantDoExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const CheckCantDoExerciseComponent:React.FC<CheckCantDoExerciseProps> = ({
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
          {exercise.records.map((record) => (
            <div key={record.id} className={styles.cantDoItem}>
              <div className={styles.cantDoHeader}>
                <span className={styles.cantDoText}>{record.text}</span>
                <span className={styles.cantDoTime}>
                  {formatTime(record.timestamp)}
                </span>
              </div>
              <div className={styles.cantDoMinimum}>
                <span>Минимальный шаг: {record.minimumDescription}</span>
                {record.minimumDone && (
                  <span className={styles.minimumDone}>✓ Минимум выполнен</span>
                )}
              </div>
            </div>
          ))}
    </ExerciseWrapper>
  );
};

export default CheckCantDoExerciseComponent
