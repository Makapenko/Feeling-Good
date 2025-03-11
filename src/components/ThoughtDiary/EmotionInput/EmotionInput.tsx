import React from 'react';
import styles from './EmotionInput.module.css';
import { Emotion } from '../types';

interface EmotionInputProps {
  emotion: Emotion;
  onEmotionChange: (emotion: Emotion) => void;
  onAdd: () => void;
}

export const EmotionInput: React.FC<EmotionInputProps> = ({
  emotion,
  onEmotionChange,
  onAdd,
}) => {
  return (
    <div className={styles.inputSection}>
      <input
        type="text"
        className={styles.emotionInput}
        value={emotion.name}
        onChange={(e) => onEmotionChange({ ...emotion, name: e.target.value })}
        placeholder="Название эмоции..."
      />
      
      <div className={styles.intensitySlider}>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={emotion.intensity}
          onChange={(e) => onEmotionChange({ ...emotion, intensity: parseInt(e.target.value) })}
        />
        <span className={styles.intensityValue}>{emotion.intensity}%</span>
      </div>

      <button 
        className={styles.addButton}
        onClick={onAdd}
        disabled={!emotion.name}
      >
        +
      </button>
    </div>
  );
}; 
