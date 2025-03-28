import React from 'react';
import { SelfSupportExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface SelfSupportExerciseProps {
  exercise: SelfSupportExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const SelfSupportExerciseComponent: React.FC<SelfSupportExerciseProps> = ({ 
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
      <div className={styles.statementsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.devaluingColumn}>Обесценивающее утверждение</div>
          <div className={styles.arrowColumn}></div>
          <div className={styles.supportingColumn}>Поддерживающее утверждение</div>
        </div>
        <div className={styles.tableBody}>
          {exercise.records.map((statement, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.devaluingColumn}>
                <p>{statement.devaluing}</p>
              </div>
              <div className={styles.arrowColumn}>→</div>
              <div className={styles.supportingColumn}>
                <p>{statement.supporting}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ExerciseWrapper>
  );
};

export default SelfSupportExerciseComponent;
