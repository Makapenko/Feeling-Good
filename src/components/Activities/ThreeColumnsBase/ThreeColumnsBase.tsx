import React, { useState } from 'react';
import styles from './ThreeColumnsBase.module.css';
import { CognitiveDistortions } from '../ThoughtDiary/CognitiveDistortions/CognitiveDistortions';

interface ThoughtRecord {
  leftColumn: string;
  cognitiveDistortion: string[];
  rightColumn: string;
}

interface ThreeColumnsBaseProps {
  title: string;
  description: string;
  leftColumnTitle: string;
  leftColumnPlaceholder: string;
  rightColumnTitle: string;
  rightColumnPlaceholder: string;
  showCognitiveDistortions?: boolean;
}

export const ThreeColumnsBase: React.FC<ThreeColumnsBaseProps> = ({
  title,
  description,
  leftColumnTitle,
  leftColumnPlaceholder,
  rightColumnTitle,
  rightColumnPlaceholder,
  showCognitiveDistortions = true
}) => {
  const [records, setRecords] = useState<ThoughtRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ThoughtRecord>({
    leftColumn: '',
    cognitiveDistortion: [],
    rightColumn: '',
  });

  const handleAddRecord = () => {
    if (currentRecord.leftColumn && currentRecord.rightColumn) {
      setRecords([...records, currentRecord]);
      setCurrentRecord({
        leftColumn: '',
        cognitiveDistortion: [],
        rightColumn: '',
      });
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
