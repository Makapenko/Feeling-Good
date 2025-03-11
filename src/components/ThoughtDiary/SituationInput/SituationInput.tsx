import React from 'react';
import styles from './SituationInput.module.css';

interface SituationInputProps {
  situation: string;
  onChange: (situation: string) => void;
  isValid: boolean;
  showValidation: boolean;
}

export const SituationInput: React.FC<SituationInputProps> = ({
  situation,
  onChange,
  isValid,
  showValidation,
}) => {
  const getFieldClassName = () => {
    if (!showValidation) return styles.field;
    return `${styles.field} ${isValid ? '' : styles.invalid}`;
  };

  return (
    <div className={styles.column}>
      <h3 title="Кратко опишите событие, которое привело к неприятной эмоции">Ситуация</h3>
      <textarea
        className={getFieldClassName()}
        value={situation}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Кратко опишите событие, которое привело к неприятной эмоции..."
      />
      {showValidation && !isValid && (
        <div className={styles.errorMessage}>Опишите ситуацию</div>
      )}
    </div>
  );
}; 
