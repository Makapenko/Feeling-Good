import React from 'react';
import { DownwardArrowExercise } from '../../Activities/DownwardArrow/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { formatTime } from '../../../utils/dateUtils';

interface DownwardArrowExerciseProps {
  exercise: DownwardArrowExercise;
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

const DownwardArrowExerciseComponent: React.FC<DownwardArrowExerciseProps> = ({
  exercise,
  expandedExercises,
  toggleExercise,
  onClose
}) => {
  const isExpanded = expandedExercises.includes(exercise.id);

  return (
    <ExerciseWrapper
      exercise={exercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      {isExpanded && (
        <div className={styles.exerciseDetails}>
          <h4>Техника падающей стрелы</h4>
          {exercise.chains.map((chain, index) => (
            <div key={chain.id} className={styles.recordContainer}>
              <div className={styles.recordHeader}>
                <span className={styles.recordNumber}>Цепочка {index + 1}</span>
                <span className={styles.recordTime}>
                  {formatTime(chain.timestamp)}
                </span>
              </div>

              <div className={styles.recordContent}>
                <div className={styles.tableContainer}>
                  <table className={styles.thoughtTable}>
                    <thead>
                      <tr>
                        <th>Автоматические мысли</th>
                        <th>Рациональные ответы</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>1.</strong> {chain.initialThought}
                        </td>
                        <td>
                          {chain.initialRationalResponse}
                        </td>
                      </tr>
                      {chain.chainItems.map((item, itemIndex) => (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <div className={styles.arrowDown}>↓</div>
                              <div className={styles.thoughtQuestion}>{item.question}</div>
                              <strong>{itemIndex + 2}.</strong> {item.text}
                            </div>
                          </td>
                          <td>{item.rationalResponse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {chain.hiddenBeliefs && (
                  <div className={styles.hiddenBeliefs}>
                    <strong>Выявленные скрытые убеждения:</strong>
                    <p>{chain.hiddenBeliefs}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {exercise.chains.length === 0 && (
            <p className={styles.emptyMessage}>
              Нет сохранённых цепочек мыслей
            </p>
          )}
        </div>
      )}
    </ExerciseWrapper>
  );
};

export default DownwardArrowExerciseComponent; 
