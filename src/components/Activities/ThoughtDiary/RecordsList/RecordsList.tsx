import React from 'react';
import styles from './RecordsList.module.css';
import { ThoughtDiaryRecord } from '../../../../types/progress.types';
import { formatDateWithOptions, formatTime } from '../../../../utils/dateUtils';

interface RecordsListProps {
  records: Array<ThoughtDiaryRecord & { date: string }>;
}

export const RecordsList: React.FC<RecordsListProps> = ({ records }) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <div className={styles.recordsList}>
      <h3>История записей</h3>
      {records.map((record, index) => (
        <div key={index} className={styles.record}>
          <div className={styles.header}>
            <span className={styles.date}>
              {formatDateWithOptions(record.date)}
              {' '}
              {formatTime(record.timestamp)}
            </span>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h4>Ситуация</h4>
              <p>{record.situation}</p>
            </div>

            <div className={styles.section}>
              <h4>Эмоции</h4>
              <ul>
                {record.emotions.map((emotion, i) => (
                  <li key={i}>
                    {emotion.name} - {emotion.intensity}%
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h4>Мысли и ответы</h4>
              {record.automaticThoughts.map((thought, i) => (
                <div key={i} className={styles.thought}>
                  <p><strong>Автоматическая мысль:</strong> {thought.thought}</p>
                  <p><strong>Когнитивные искажения:</strong> {thought.cognitiveDistortions.join(', ')}</p>
                  <p><strong>Рациональный ответ:</strong> {thought.rationalResponse}</p>
                </div>
              ))}
            </div>

            {record.result.emotions.length > 0 && (
              <div className={styles.section}>
                <h4>Результат</h4>
                <ul>
                  {record.result.emotions.map((emotion, i) => (
                    <li key={i}>
                      {emotion.name} - {emotion.intensity}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 
