import React from 'react';
import { ThreeColumnsExercise } from '../../Activities/ThreeColumnsBase/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from './ThreeColumnsExerciseComponent.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';

interface ThreeColumnsExerciseProps {
  exercise: ThreeColumnsExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const ThreeColumnsExerciseComponent: React.FC<ThreeColumnsExerciseProps> = ({ 
  exercise, 
  expandedExercises, 
  toggleExercise,
  onClose 
}) => {
  // Определяем заголовки колонок в зависимости от типа упражнения
  const getColumnTitles = () => {
    switch (exercise.type) {
      case ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS:
        return {
          left: 'Мешающая мысль',
          right: 'Помогающая мысль'
        };
      case ACTIVITY_IDS.HOT_COOL_THOUGHTS:
        return {
          left: '«Горячие» мысли',
          right: '«Прохладные» мысли'
        };
      case ACTIVITY_IDS.REWRITE_SHOULD_RULES:
        return {
          left: 'Правило со словом «должен»',
          right: 'Более гибкое правило'
        };
      case ACTIVITY_IDS.RATIONAL_RESPONSES:
        return {
          left: 'Самокритика',
          right: 'Рациональный ответ'
        };
      case ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES:
        return {
          left: 'Преимущества убеждения',
          right: 'Недостатки убеждения'
        };
      default:
        return {
          left: 'Автоматическая мысль',
          right: 'Рациональный ответ'
        };
    }
  };

  const columnTitles = getColumnTitles();

  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      <div className={styles.recordsList}>
        {exercise.records.map((record, index) => (
          <div key={index} className={styles.record}>
            <div className={styles.recordTime}>
              {new Date(record.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className={styles.recordContent}>
              <div className={styles.column}>
                <strong>{columnTitles.left}:</strong>
                <p>{record.leftColumn}</p>
              </div>
              {record.cognitiveDistortion && record.cognitiveDistortion.length > 0 && (
                <div className={styles.column}>
                  <strong>Когнитивные искажения:</strong>
                  <p>{record.cognitiveDistortion.join(', ')}</p>
                </div>
              )}
              <div className={styles.column}>
                <strong>{columnTitles.right}:</strong>
                <p>{record.rightColumn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default ThreeColumnsExerciseComponent; 
