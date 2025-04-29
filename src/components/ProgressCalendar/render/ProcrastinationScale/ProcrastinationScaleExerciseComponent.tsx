import React from 'react';
import styles from '../../DayDetails.module.css';
import { procrastinationConfig } from '../../../Activities/ProcrastinationScale/procrastinationConfig';

export interface ProcrastinationScaleExercise {
  id: string;
  type: string;
  name: string;
  date: string;
  completedAt: string;
  score: number;
  maxScore: number;
}

interface ProcrastinationScaleExerciseComponentProps {
  exercise: ProcrastinationScaleExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
}

const ProcrastinationScaleExerciseComponent: React.FC<ProcrastinationScaleExerciseComponentProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
}) => {
  const isExpanded = expandedExercises.includes(exercise.id);
  
  // Находим интерпретацию результата
  const getResultInterpretation = () => {
    const { results } = procrastinationConfig;
    const result = results.find(
      r => exercise.score >= r.minScore && exercise.score <= r.maxScore
    );
    
    return result ? result.description : 'Интерпретация не найдена';
  };

  const handleToggle = () => {
    toggleExercise(exercise.id);
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseHeader} onClick={handleToggle}>
        <div className={styles.exerciseTitle}>
          <h4>Шкала иррациональной прокрастинации</h4>
          <div className={styles.exerciseMeta}>
            {new Date(exercise.completedAt).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <div className={styles.exerciseScore}>
          <span>Баллы: {exercise.score} из {exercise.maxScore}</span>
          <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
            {isExpanded ? '▼' : '►'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className={styles.exerciseDetails}>
          <div className={styles.resultInterpretation}>
            <h5>Интерпретация:</h5>
            <p>{getResultInterpretation()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcrastinationScaleExerciseComponent; 
