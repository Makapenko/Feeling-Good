import React from 'react';
import { EmotionInput } from '../EmotionInput/EmotionInput';
import { EmotionsList } from '../EmotionsList/EmotionsList';
import { Emotion } from '../types';
import styles from './EmotionsSection.module.css';

interface EmotionsSectionProps {
  title: string;
  titleTooltip: string;
  emotion: Emotion;
  emotions: Emotion[];
  onEmotionChange: (emotion: Emotion) => void;
  onAdd: () => void;
  onEdit: (index: number) => void;
  showIntensity?: boolean;
}


export const EmotionsSection: React.FC<EmotionsSectionProps> = ({
  title,
  titleTooltip,
  emotion,
  emotions,
  onEmotionChange,
  onAdd,
  onEdit,
  showIntensity = true,
}) => {
  return (
    <div className={styles.column}>
      <h3 className={styles.h3} title={titleTooltip}>{title}</h3>
      <EmotionInput
        emotion={emotion}
        onEmotionChange={onEmotionChange}
        onAdd={onAdd}
        showIntensity={showIntensity}
      />
      {emotions.length > 0 && (
        <div className={styles.emotionsList}>
          <EmotionsList
            emotions={emotions}
            onEdit={onEdit}
            showIntensity={showIntensity}
          />
        </div>
      )}
    </div>
  );
}; 
