import React from 'react';
import styles from './ThoughtInput.module.css';
import { AutomaticThought } from '../types';
import { CognitiveDistortions } from '../CognitiveDistortions/CognitiveDistortions';
import { RationalResponse } from '../RationalResponse/RationalResponse';

interface ThoughtInputProps {
  thoughts: AutomaticThought[];
  onThoughtChange: (field: keyof AutomaticThought, value: string | string[], index: number) => void;
  onAddThought: () => void;
  onDeleteThought: (index: number) => void;
}

export const ThoughtInput: React.FC<ThoughtInputProps> = ({
  thoughts,
  onThoughtChange,
  onAddThought,
  onDeleteThought,
}) => {
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const canAddNewThought = (index: number): boolean => {
    const currentThought = thoughts[index];
    return !!currentThought.thought.trim();
  };

  return (
    <div className={styles.thoughtsContainer}>
      <h3 title='Запишите автоматические мысли, которые сопутствуют данным эмоциям'>Автоматические мысли</h3>
      <div className={styles.thoughtsList}>
        {thoughts.map((thought, index) => (
          <div key={index} className={styles.thoughtRow}>
            <div className={styles.thoughtHeader}>
              <div className={styles.thoughtNumber}>{index + 1}</div>
              <div className={styles.thoughtField}>
                <textarea
                  className={styles.thoughtInput}
                  value={thought.thought}
                  onChange={(e) => {
                    onThoughtChange('thought', e.target.value, index);
                    adjustTextareaHeight(e.target);
                  }}
                  onFocus={(e) => adjustTextareaHeight(e.target)}
                  placeholder="Запишите автоматическую мысль..."
                  rows={1}
                />
              </div>
              {index > 0 && (
                <button
                  className={styles.deleteThoughtButton}
                  onClick={() => onDeleteThought(index)}
                  title="Удалить мысль"
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.thoughtAnalysis}>
              <CognitiveDistortions
                selectedDistortions={thought.cognitiveDistortions}
                onChange={(distortions) => onThoughtChange('cognitiveDistortions', distortions, index)}
              />
              <RationalResponse
                response={thought.rationalResponse}
                onChange={(response) => onThoughtChange('rationalResponse', response, index)}
              />
            </div>
            <div className={styles.containerAddThoughtButton}> {index === thoughts.length - 1 && (
              <button
                className={styles.addThoughtButton}
                onClick={onAddThought}
                disabled={!canAddNewThought(index)}
              >
                + Добавить {thoughts.length + 1}-ю негативную мысль
              </button>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
