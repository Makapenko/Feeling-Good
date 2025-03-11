import React from 'react';
import styles from './EmotionsList.module.css';
import { Emotion } from '../types';

interface EmotionsListProps {
  emotions: Emotion[];
  onEdit: (index: number) => void;
}

export const EmotionsList: React.FC<EmotionsListProps> = ({ emotions, onEdit }) => {
  return (
    <div className={styles.emotionsList}>
      {emotions.map((emotion, index) => (
        <div 
          key={index} 
          className={styles.emotion}
          onClick={() => onEdit(index)}
        >
          <span>{emotion.name}: {emotion.intensity}%</span>
          <span className={styles.editHint}>Нажмите для редактирования</span>
        </div>
      ))}
    </div>
  );
}; 
