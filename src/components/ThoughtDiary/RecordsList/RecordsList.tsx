import React from 'react';
import { ThoughtRecord } from '../types';
import styles from './RecordsList.module.css';

interface RecordsListProps {
  records: ThoughtRecord[];
}

export const RecordsList: React.FC<RecordsListProps> = ({ records }) => {
  return (
    <div className={styles.recordsList}>
      {records.map((record, index) => (
        <div key={index} className={styles.recordContainer}>
          <div className={styles.situationHeader}>
            <h4>Ситуация:</h4>
            <p>{record.situation}</p>
          </div>
          
          <div className={styles.emotionsContainer}>
            <div className={styles.emotionsHeader}>
              <h4>Начальные эмоции:</h4>
              <div className={styles.emotions}>
                {record.emotions.map((emotion, i) => (
                  <span key={i} className={styles.emotion}>
                    {emotion.name}: {emotion.intensity}%
                  </span>
                ))}
              </div>
            </div>
          </div>

          <table className={styles.thoughtsTable}>
            <thead>
              <tr>
                <th>Автоматические мысли</th>
                <th>Искажения</th>
                <th>Рациональный ответ</th>
              </tr>
            </thead>
            <tbody>
              {record.automaticThoughts.map((thought, i) => (
                <tr key={i}>
                  <td>{thought.thought}</td>
                  <td>{thought.cognitiveDistortions.join(', ')}</td>
                  <td>{thought.rationalResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.emotionsContainer}>
            <div className={styles.emotionsHeader}>
              <h4>Конечные эмоции:</h4>
              <div className={styles.emotions}>
                {record.result.emotions.map((emotion, i) => (
                  <span key={i} className={styles.emotion}>
                    {emotion.name}: {emotion.intensity}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
