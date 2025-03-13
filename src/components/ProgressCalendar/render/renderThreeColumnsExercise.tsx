import React from 'react';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import ExerciseWrapper from './renderExerciseWrapper';
import styles from '../DayDetails.module.css';

interface ThreeColumnsExerciseProps {
  exercise: ThreeColumnsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const ThreeColumnsExerciseComponent: React.FC<ThreeColumnsExerciseProps> = ({ 
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
                <strong>Автоматическая мысль:</strong>
                <p>{record.leftColumn}</p>
              </div>
              {record.cognitiveDistortion.length > 0 && (
                <div className={styles.column}>
                  <strong>Когнитивные искажения:</strong>
                  <p>{record.cognitiveDistortion.join(', ')}</p>
                </div>
              )}
              <div className={styles.column}>
                <strong>Рациональный ответ:</strong>
                <p>{record.rightColumn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default ThreeColumnsExerciseComponent; 
