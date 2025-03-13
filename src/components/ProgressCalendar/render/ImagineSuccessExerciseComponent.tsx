import React from 'react';
import {  ImagineSuccessExercise, ImagineSuccessRecord } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface ImagineSuccessExerciseProps {
  exercise: ImagineSuccessExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const ImagineSuccessExerciseComponent: React.FC<ImagineSuccessExerciseProps> = ({ 
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
        {exercise.records.map((record: ImagineSuccessRecord) => (
          <div key={record.id} className={styles.record}>
            <div className={styles.timestamp}>
              {new Date(record.timestamp).toLocaleString()}
            </div>
            <div className={styles.content}>
              <div className={styles.goal}>
                <strong>Цель:</strong> {record.goal}
              </div>
              <div className={styles.advantages}>
                <strong>Преимущества:</strong>
                <ul>
                  {record.advantages.map((advantage) => (
                    <li key={advantage.id}>{advantage.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default ImagineSuccessExerciseComponent;
