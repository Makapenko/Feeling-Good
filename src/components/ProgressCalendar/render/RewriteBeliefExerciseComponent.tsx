import React from 'react';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { RewriteBeliefExercise } from '../../../components/Activities/RewriteBelief/types';

interface RewriteBeliefExerciseProps {
  exercise: RewriteBeliefExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const RewriteBeliefExerciseComponent: React.FC<RewriteBeliefExerciseProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
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
          <div className={styles.devaluingColumn}>Старое убеждение</div>
          <div className={styles.arrowColumn}></div>
          <div className={styles.supportingColumn}>Новое убеждение</div>
        </div>
        <div className={styles.tableBody}>
          <div className={styles.tableRow}>
            <div className={styles.devaluingColumn}>
              <p>{exercise.belief}</p>
            </div>
            <div className={styles.arrowColumn}>→</div>
            <div className={styles.supportingColumn}>
              <p>{exercise.newBelief}</p>
            </div>
          </div>
        </div>
      </div>
    </ExerciseWrapper>
  );
};

export default RewriteBeliefExerciseComponent;
