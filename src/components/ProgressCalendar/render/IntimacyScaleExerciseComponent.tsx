import React from 'react';
import { IntimacyScaleExercise } from '../../Activities/IntimacyScale/types';
import { INTIMACY_CATEGORY_DESCRIPTIONS } from '../../Activities/IntimacyScale/intimacyConfig';
import ExerciseWrapper from './ExerciseWrapper';
import calStyles from './DysfunctionalAttitudeScale/DysfunctionalAttitudeScaleExerciseComponent.module.css';

interface IntimacyScaleExerciseComponentProps {
  exercise: IntimacyScaleExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const IntimacyScaleExerciseComponent: React.FC<IntimacyScaleExerciseComponentProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
  onClose
}) => {
  const totalScore = exercise.totalScore ?? exercise.categoryResults?.reduce(
    (sum, cat) => sum + (cat.score || 0),
    0
  ) ?? 0;

  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      {expandedExercises.includes(exercise.id) && (
        <div className={calStyles.container}>
          <p className={calStyles.summary}>
            Пройден тест из 60 вопросов. Общий балл: {totalScore} из 180.
          </p>

          <div className={calStyles.resultsContainer}>
            {exercise.categoryResults.map((result) => {
              const categoryDesc = INTIMACY_CATEGORY_DESCRIPTIONS.find(
                desc => desc.category === result.category
              );
              if (!categoryDesc) return null;

              const isHigh = result.score >= 6;

              return (
                <div
                  key={result.category}
                  className={`${calStyles.categoryResult} ${isHigh ? calStyles.weakness : calStyles.strength}`}
                >
                  <div className={calStyles.categoryHeader}>
                    <strong>{categoryDesc.title}:</strong>
                    <span className={calStyles.score}>
                      {result.score} / {result.maxScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ExerciseWrapper>
  );
};

export default IntimacyScaleExerciseComponent;
