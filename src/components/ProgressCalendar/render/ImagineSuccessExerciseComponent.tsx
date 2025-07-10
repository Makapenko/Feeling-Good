import React from 'react';
import {  ImagineSuccessExercise, ImagineSuccessRecord } from '../../Activities/ImagineSuccess/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { formatDateTime } from '../../../utils/dateUtils';

interface ImagineSuccessExerciseProps {
  exercise: ImagineSuccessExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const ImagineSuccessExerciseComponent: React.FC<ImagineSuccessExerciseProps> = ({ 
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
        {exercise.records.map((record: ImagineSuccessRecord) => (
          <div key={record.id} className={styles.record}>
            <div className={styles.timestamp}>
              {formatDateTime(record.timestamp)}
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
    </ExerciseWrapper>
  );
};

export default ImagineSuccessExerciseComponent;
