import React from 'react';
import { Exercise } from "../../../types/progress.types";
import styles from '../DayDetails.module.css';

interface ExerciseWrapperProps {
  exercise: Exercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  children: React.ReactNode;
}

const ExerciseWrapper: React.FC<ExerciseWrapperProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise,
  children 
}) => {
  const isExpanded = expandedExercises.includes(exercise.id);
  return (
    <div key={exercise.id} className={styles.exerciseSection}>
      <div 
        className={styles.exerciseHeader} 
        onClick={() => toggleExercise(exercise.id)}
      >
        <h4>{exercise.name}</h4>
        <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▼</span>
      </div>
      <div className={`${styles.exerciseContent} ${isExpanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ExerciseWrapper; 
