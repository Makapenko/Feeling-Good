import React from 'react';
import { DysfunctionalAttitudeScaleExercise } from '../../../Activities/DysfunctionalAttitudeScale/types';
import ExerciseWrapper from '../ExerciseWrapper';
import styles from './DysfunctionalAttitudeScaleExerciseComponent.module.css';
import { CATEGORY_DESCRIPTIONS } from '../../../Activities/DysfunctionalAttitudeScale/dasConfig';

interface DysfunctionalAttitudeScaleExerciseProps {
  exercise: DysfunctionalAttitudeScaleExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const DysfunctionalAttitudeScaleExerciseComponent: React.FC<DysfunctionalAttitudeScaleExerciseProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
  onClose
}) => {
  const answersCount = Object.keys(exercise.answers).length;
  
  // Функция для получения описания категории в зависимости от значения
  const getCategoryDescription = (category: string, score: number) => {
    const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === category);
    if (!categoryDesc) return '';
    
    // Если значение >= 0, используем позитивное описание, иначе негативное
    return score >= 0 ? categoryDesc.positiveDescription : categoryDesc.negativeDescription;
  };
  
  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      {expandedExercises.includes(exercise.id) && (
        <div className={styles.container}>
          <p className={styles.summary}>
            Пройден опрос из {answersCount} вопросов. Результаты в разрезе категорий:
          </p>
          
          <div className={styles.resultsContainer}>
            {exercise.categoryResults.map((result) => {
              const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === result.category);
              
              if (!categoryDesc) return null;
              
              // Получаем описание в зависимости от значения
              const description = getCategoryDescription(result.category, result.score);
              
              return (
                <div 
                  key={result.category} 
                  className={`${styles.categoryResult} ${result.isStrength ? styles.strength : styles.weakness}`}
                >
                  <div className={styles.categoryHeader}>
                    <strong>{categoryDesc.title}:</strong>
                    <span className={styles.score}>
                      {result.score > 0 ? '+' : ''}{result.score}
                    </span>
                  </div>
                  <p className={styles.categoryDescription}>
                    {/* Отображаем краткий отрывок описания для календаря */}
                    {description.slice(0, 100) + (description.length > 100 ? '...' : '')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ExerciseWrapper>
  );
};

export default DysfunctionalAttitudeScaleExerciseComponent; 
