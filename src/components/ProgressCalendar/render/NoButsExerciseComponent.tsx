import React from 'react';
import { NoButsExercise } from '../../Activities/NoButsSheet/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface NoButsExerciseProps {
  exercise: NoButsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}


const NoButsExerciseComponent: React.FC<NoButsExerciseProps> = ({ 
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
      <div className={styles.pairsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.butColumn}>Отговорка</div>
          <div className={styles.arrowColumn}></div>
          <div className={styles.noButColumn}>Альтернатива</div>
        </div>
        <div className={styles.tableBody}>
          {exercise.records.map((pair, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.butColumn}>
                <p>{pair.but}</p>
              </div>
              <div className={styles.arrowColumn}>→</div>
              <div className={styles.noButColumn}>
                <p>{pair.noBut}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ExerciseWrapper>
  );
};

export default NoButsExerciseComponent;
