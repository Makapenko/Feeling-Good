import React from 'react';
import { CountAchievementsExercise } from '../../Activities/CountAchievements/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { formatTime } from '../../../utils/dateUtils';

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
                {formatTime(record.timestamp)}
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
