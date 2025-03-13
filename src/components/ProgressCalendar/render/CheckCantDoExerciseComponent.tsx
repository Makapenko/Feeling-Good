import React from 'react';
import {  CheckCantDoExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface  CheckCantDoExerciseProps {
  exercise: CheckCantDoExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const CheckCantDoExerciseComponent:React.FC<CheckCantDoExerciseProps> = ({
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
      <div className={styles.exerciseSection}>
        <h3>{exercise.name}</h3>
        <div className={styles.cantDoList}>
          {exercise.records.map((record) => (
            <div key={record.id} className={styles.cantDoItem}>
              <div className={styles.cantDoHeader}>
                <span className={styles.cantDoText}>{record.text}</span>
                <span className={styles.cantDoTime}>
                  {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
        </div>
      </div>
    </ExerciseWrapper>
  );
};

export default CheckCantDoExerciseComponent
