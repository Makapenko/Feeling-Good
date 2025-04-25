import React from 'react';
import { ThoughtDiaryExercise } from '../../Activities/ThoughtDiary/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';

interface ThoughtDiaryExerciseProps {
  exercise: ThoughtDiaryExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const ThoughtDiaryExerciseComponent: React.FC<ThoughtDiaryExerciseProps> = ({ 
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
                <strong>Ситуация:</strong>
                <p>{record.situation}</p>
              </div>
              <div className={styles.column}>
                <strong>Эмоции:</strong>
                <ul>
                  {record.emotions.map((emotion, i) => (
                    <li key={i}>{emotion.name} - {emotion.intensity}%</li>
                  ))}
                </ul>
              </div>
              {record.automaticThoughts.map((thought, i) => (
                <div key={i} className={styles.thought}>
                  <p><strong>Автоматическая мысль:</strong> {thought.thought}</p>
                  <p><strong>Когнитивные искажения:</strong> {thought.cognitiveDistortions.join(', ')}</p>
                  <p><strong>Рациональный ответ:</strong> {thought.rationalResponse}</p>
                </div>
              ))}
              {record.result.emotions.length > 0 && (
                <div className={styles.column}>
                  <strong>Результат:</strong>
                  <ul>
                    {record.result.emotions.map((emotion, i) => (
                      <li key={i}>{emotion.name} - {emotion.intensity}%</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ExerciseWrapper>
  );
};

export default ThoughtDiaryExerciseComponent;
