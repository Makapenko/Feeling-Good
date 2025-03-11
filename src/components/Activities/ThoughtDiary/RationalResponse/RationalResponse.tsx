import React from 'react';
import styles from './RationalResponse.module.css';

interface RationalResponseProps {
  response: string;
  onChange: (response: string) => void;
}

export const RationalResponse: React.FC<RationalResponseProps> = ({
  response,
  onChange,
}) => {
  return (
    <div className={styles.column}>
      <h3 title='Запишите рациональный ответ на автоматическую мысль'>Рациональный ответ</h3>
      <textarea
        className={styles.textarea}
        value={response}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Запишите рациональный ответ..."
      />
    </div>
  );
}; 
