import React from 'react';
import { NoLoseTechniqueExercise } from '../../Activities/NoLoseTechnique/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface NoLoseTechniqueExerciseProps {
  exercise: NoLoseTechniqueExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const NoLoseTechniqueExerciseComponent: React.FC<NoLoseTechniqueExerciseProps> = ({ 
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
      <div className={styles.recordsList}>
        {exercise.records.map((record) => (
          <div key={record.id} className={styles.record}>
            <div className={styles.recordTime}>
              {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className={styles.recordContent}>
              <div className={styles.column}>
                <strong>Негативные последствия:</strong>
                <p>{record.leftColumn}</p>
              </div>
              {record.cognitiveDistortion.length > 0 && (
                <div className={styles.column}>
                  <strong>Когнитивные искажения:</strong>
                  <p>{record.cognitiveDistortion.join(', ')}</p>
                </div>
              )}
              <div className={styles.column}>
                <strong>Позитивные мысли и стратегии:</strong>
                <p>{record.rightColumn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default NoLoseTechniqueExerciseComponent;
