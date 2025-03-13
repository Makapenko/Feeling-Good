import React from 'react';
import { CountAchievementsExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface CountAchievementsExerciseProps {
  exercise: CountAchievementsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const CountAchievementsExerciseComponent:React.FC<CountAchievementsExerciseProps> = ({
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
        <div className={styles.achievementsList}>
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
        </div>
      </div>
    </ExerciseWrapper>
  );
};

export default CountAchievementsExerciseComponent
