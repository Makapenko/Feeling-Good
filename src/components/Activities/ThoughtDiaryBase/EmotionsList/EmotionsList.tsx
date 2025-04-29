import React from 'react';
import styles from './EmotionsList.module.css';
import { Emotion } from '../types';

interface EmotionsListProps {
  emotions: Emotion[];
  onEdit: (index: number) => void;
  showIntensity?: boolean;
}

export const EmotionsList: React.FC<EmotionsListProps> = ({
  emotions,
  onEdit,
  showIntensity = true,
}) => {
  return (
    <div className={styles.emotionChips}>
      {emotions.map((emotion, index) => (
        <div key={index} className={styles.emotionChip} onClick={() => onEdit(index)}>
          <span className={styles.emotionName}>{emotion.name} - </span>
          {showIntensity && (
            <span className={styles.emotionIntensity}>{emotion.intensity}%</span>
          )}
        </div>
      ))}
    </div>
  );
}; 
