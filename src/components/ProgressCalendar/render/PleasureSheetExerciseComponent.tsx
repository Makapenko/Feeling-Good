import React from 'react';
import { PleasureSheetExercise } from '../../../types/progress.types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface PleasureSheetExerciseProps {
  exercise: PleasureSheetExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const PleasureSheetExerciseComponent: React.FC<PleasureSheetExerciseProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise ,
  onClose
}) => {
  const getComparisonClass = (actual: number | null, expected: number) => {
    if (actual === null) return '';
    if (actual === expected) return styles.same;
    return actual > expected ? styles.better : styles.worse;
  };

  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      <div className={styles.activityList}>
        {exercise.records.map((activity, index) => (
          <div key={index} className={styles.activity}>
            <div className={styles.activityContent}>
              <div className={styles.activityTime}>
                {new Date(activity.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.activityDetails}>
                <p><strong>Занятие:</strong> {activity.text}</p>
                <p><strong>С кем:</strong> {activity.participants}</p>
                <div className={styles.activityRatings}>
                  <div>
                    <strong>Предполагаемое удовольствие:</strong> 
                    <span>{activity.expectedPleasure}%</span>
                  </div>
                  {activity.actualPleasure !== null && (
                    <div>
                      <strong>Реальное удовольствие:</strong> 
                      <span className={getComparisonClass(activity.actualPleasure, activity.expectedPleasure)}>
                        {activity.actualPleasure}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default PleasureSheetExerciseComponent;
