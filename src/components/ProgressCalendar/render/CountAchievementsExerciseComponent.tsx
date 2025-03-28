import React from 'react';
import { CountAchievementsExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface CountAchievementsExerciseProps {
  exercise: CountAchievementsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const CountAchievementsExerciseComponent:React.FC<CountAchievementsExerciseProps> = ({
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
          {exercise.records.map((record) => (
            <div key={record.id} className={styles.record}>
              <div className={styles.timestamp}>
                {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.achievementText}>
                {record.text}
              </div>
            </div>
          ))}
    </ExerciseWrapper>
  );
};

export default CountAchievementsExerciseComponent
