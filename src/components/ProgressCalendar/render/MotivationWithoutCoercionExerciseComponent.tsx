import React from 'react';
import { MotivationWithoutCoercionExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface MotivationWithoutCoercionExerciseProps {
  exercise: MotivationWithoutCoercionExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const MotivationWithoutCoercionExerciseComponent: React.FC<MotivationWithoutCoercionExerciseProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise 
}) => {
  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
    >
      <div className={styles.recordsList}>
        {exercise.records.map((record, index) => (
          <div key={index} className={styles.record}>
            <div className={styles.recordTime}>
              {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
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
      </div>
    </ExerciseWrapper>
  );
};

export default MotivationWithoutCoercionExerciseComponent;
