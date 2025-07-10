import React from 'react';
import { MotivationWithoutCoercionExercise } from '../../Activities/MotivationWithoutCoercion/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { formatTime } from '../../../utils/dateUtils';

interface MotivationWithoutCoercionExerciseProps {
  exercise: MotivationWithoutCoercionExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const MotivationWithoutCoercionExerciseComponent: React.FC<MotivationWithoutCoercionExerciseProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise ,
  onClose
}) => {
  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
        {exercise.records.map((record, index) => (
          <div key={index} className={styles.record}>
            <div className={styles.recordTime}>
              {formatTime(record.timestamp)}
            </div>
            <div className={styles.recordContent}>
              <div className={styles.column}>
                <strong>Мысль:</strong>
                <p>{record.thought}</p>
              </div>
              <div className={styles.columnsContainer}>
                <div className={styles.column}>
                  <strong>Преимущества:</strong>
                  <ul>
                    {record.advantages.map((advantage, i) => (
                      <li key={i}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.column}>
                  <strong>Недостатки:</strong>
                  <ul>
                    {record.disadvantages.map((disadvantage, i) => (
                      <li key={i}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
    </ExerciseWrapper>
  );
};

export default MotivationWithoutCoercionExerciseComponent;
