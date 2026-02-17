import React from 'react';
import { UniversalCounterExercise } from '../../Activities/UniversalCounter/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface UniversalCounterExerciseComponentProps {
  exercise: UniversalCounterExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const UniversalCounterExerciseComponent: React.FC<UniversalCounterExerciseComponentProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
  onClose,
}) => {
  const clicksWithNotes = exercise.clicks.filter(c => c.note);

  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      <div className={styles.record}>
        <strong>Нажатий: {exercise.clicks.length}</strong>
      </div>
      {clicksWithNotes.length > 0 && (
        <>
          {clicksWithNotes.map((click) => (
            <div key={click.id} className={styles.record}>
              <div className={styles.timestamp}>
                {new Date(click.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={styles.achievementText}>{click.note}</div>
            </div>
          ))}
        </>
      )}
    </ExerciseWrapper>
  );
};

export default UniversalCounterExerciseComponent;
