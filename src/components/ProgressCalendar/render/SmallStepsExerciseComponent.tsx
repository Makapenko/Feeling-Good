import React from 'react';
import { SmallStepsExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface SmallStepsExerciseProps {
  exercise: SmallStepsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const SmallStepsExerciseComponent: React.FC<SmallStepsExerciseProps> = ({ 
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
      <div className={styles.tasksList}>
        {exercise.records.map((task, index) => (
          <div key={index} className={styles.task}>
            <div className={styles.taskContent}>
              <h5>{task.title}</h5>
              <div className={styles.stepsList}>
                {task.steps.map((step, stepIndex) => (
                  <div 
                    key={stepIndex} 
                    className={`${styles.step} ${step.isCompleted ? styles.completed : ''} ${step.isRest ? styles.restStep : ''}`}
                  >
                    <div className={styles.stepContent}>
                      <span className={styles.stepText}>{step.text}</span>
                      <span className={styles.stepDuration}>{step.duration} мин</span>
                    </div>
                  </div>
                ))}
              </div>
              {task.isCompleted && (
                <div className={styles.completionMessage}>
                  Задача выполнена
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default SmallStepsExerciseComponent;
