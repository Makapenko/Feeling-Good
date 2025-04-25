import React from 'react';
import { AntiProcrastinationExercise } from '../../Activities/AntiProcrastinationSheet/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface AntiProcrastinationExerciseProps {
  exercise: AntiProcrastinationExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const AntiProcrastinationExerciseComponent: React.FC<AntiProcrastinationExerciseProps> = ({ 
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
      <div className={styles.tasksList}>
        {exercise.records.map((task, index) => (
          <div key={index} className={styles.task}>
            <div className={styles.taskContent}>
              <p className={styles.taskText}>{task.text}</p>
              <div className={styles.taskRatings}>
                <div>
                  <strong>Ожидаемая сложность:</strong> {task.expectedDifficulty}%
                </div>
                <div>
                  <strong>Ожидаемое удовольствие:</strong> {task.expectedPleasure}%
                </div>
                {task.completed && (
                  <>
                    <div>
                      <strong>Реальная сложность:</strong> {task.actualDifficulty ?? '-'}%
                    </div>
                    <div>
                      <strong>Реальное удовольствие:</strong> {task.actualPleasure ?? '-'}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default AntiProcrastinationExerciseComponent;
