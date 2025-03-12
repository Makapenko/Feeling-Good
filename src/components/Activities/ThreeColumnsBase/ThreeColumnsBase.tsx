import React, { useState } from 'react';
import styles from './ThreeColumnsBase.module.css';
import { CognitiveDistortions } from '../ThoughtDiary/CognitiveDistortions/CognitiveDistortions';
import { ThoughtRecord, ThreeColumnsMethodResult } from './types';

interface ThreeColumnsBaseProps {
  title: string;
  description: string;
  leftColumnTitle: string;
  leftColumnPlaceholder: string;
  rightColumnTitle: string;
  rightColumnPlaceholder: string;
  showCognitiveDistortions?: boolean;
  methodId: string;
  onSave?: (result: ThreeColumnsMethodResult) => void;
}

export const ThreeColumnsBase: React.FC<ThreeColumnsBaseProps> = ({
  title,
  description,
  leftColumnTitle,
  leftColumnPlaceholder,
  rightColumnTitle,
  rightColumnPlaceholder,
  showCognitiveDistortions = true,
  methodId,
  onSave
}) => {
  const [records, setRecords] = useState<ThoughtRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Omit<ThoughtRecord, 'timestamp'>>({
    leftColumn: '',
    cognitiveDistortion: [],
    rightColumn: '',
  });

  const handleAddRecord = () => {
    if (currentRecord.leftColumn && currentRecord.rightColumn) {
      const newRecord: ThoughtRecord = {
        ...currentRecord,
        timestamp: new Date().toISOString()
      };
      const newRecords = [...records, newRecord];
      setRecords(newRecords);
      setCurrentRecord({
        leftColumn: '',
        cognitiveDistortion: [],
        rightColumn: '',
      });

      // Сохраняем результат
      if (onSave) {
        const result: ThreeColumnsMethodResult = {
          id: methodId,
          name: title,
          completed: true,
          completedAt: new Date().toISOString(),
          records: newRecords
        };
        onSave(result);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p className={styles.description}>{description}</p>

      <div className={styles.inputSection}>
        <div className={styles.column}>
          <h3>{leftColumnTitle}</h3>
          <textarea
            value={currentRecord.leftColumn}
            onChange={(e) => setCurrentRecord({
              ...currentRecord,
              leftColumn: e.target.value
            })}
            placeholder={leftColumnPlaceholder}
          />
        </div>

        {showCognitiveDistortions && (
          <CognitiveDistortions
            selectedDistortions={currentRecord.cognitiveDistortion}
            onChange={(distortions) => setCurrentRecord({
              ...currentRecord,
              cognitiveDistortion: distortions
            })}
          />
        )}

        <div className={styles.column}>
          <h3>{rightColumnTitle}</h3>
          <textarea
            value={currentRecord.rightColumn}
            onChange={(e) => setCurrentRecord({
              ...currentRecord,
              rightColumn: e.target.value
            })}
            placeholder={rightColumnPlaceholder}
          />
        </div>
      </div>

      <button 
        className={styles.addButton}
        onClick={handleAddRecord}
        disabled={!currentRecord.leftColumn || !currentRecord.rightColumn}
      >
        Добавить запись
      </button>

      <div className={styles.recordsList}>
        <table>
          <thead>
            <tr>
              <th>{leftColumnTitle}</th>
              {showCognitiveDistortions && <th>Когнитивные искажения</th>}
              <th>{rightColumnTitle}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.leftColumn}</td>
                {showCognitiveDistortions && <td>{record.cognitiveDistortion.join(', ')}</td>}
                <td>{record.rightColumn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
