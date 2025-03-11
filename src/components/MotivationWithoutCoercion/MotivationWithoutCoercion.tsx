import React, { useState } from 'react';
import styles from './MotivationWithoutCoercion.module.css';

interface ComparisonRecord {
  thought: string;
  advantages: string[];
  disadvantages: string[];
}
// DisarmingTechnique

export const MotivationWithoutCoercion: React.FC = () => {
  const [currentThought, setCurrentThought] = useState('');
  const [currentAdvantage, setCurrentAdvantage] = useState('');
  const [currentDisadvantage, setCurrentDisadvantage] = useState('');
  const [records, setRecords] = useState<ComparisonRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<ComparisonRecord | null>(null);

  const handleAddThought = () => {
    if (currentThought.trim()) {
      const newRecord: ComparisonRecord = {
        thought: currentThought,
        advantages: [],
        disadvantages: []
      };
      setRecords([...records, newRecord]);
      setActiveRecord(newRecord);
      setCurrentThought('');
    }
  };

  const handleAddAdvantage = () => {
    if (currentAdvantage.trim() && activeRecord) {
      const updatedRecords = records.map(record => 
        record.thought === activeRecord.thought
          ? { ...record, advantages: [...record.advantages, currentAdvantage] }
          : record
      );
      setRecords(updatedRecords);
      setActiveRecord({ ...activeRecord, advantages: [...activeRecord.advantages, currentAdvantage] });
      setCurrentAdvantage('');
    }
  };

  const handleAddDisadvantage = () => {
    if (currentDisadvantage.trim() && activeRecord) {
      const updatedRecords = records.map(record => 
        record.thought === activeRecord.thought
          ? { ...record, disadvantages: [...record.disadvantages, currentDisadvantage] }
          : record
      );
      setRecords(updatedRecords);
      setActiveRecord({ ...activeRecord, disadvantages: [...activeRecord.disadvantages, currentDisadvantage] });
      setCurrentDisadvantage('');
    }
  };
 // TODO на самом деле это техника Мотивация без принуждения, а эту технику нужно сделать в другом компоненте
  return (
    <div className={styles.container}>
      <h2>Мотивация без принуждения</h2>
      <p className={styles.description}>
        Запишите мысль, которая вас беспокоит, и проанализируйте преимущества и недостатки
        этой ситуации, чтобы найти более сбалансированный взгляд.
      </p>

      <div className={styles.thoughtInput}>
        <input
          type="text"
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
          placeholder="Введите беспокоящую мысль..."
          className={styles.input}
        />
        <button 
          onClick={handleAddThought}
          className={styles.addButton}
          disabled={!currentThought.trim()}
        >
          Добавить мысль
        </button>
      </div>

      {activeRecord && (
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h3>Преимущества</h3>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={currentAdvantage}
                onChange={(e) => setCurrentAdvantage(e.target.value)}
                placeholder="Добавить преимущество..."
                className={styles.input}
              />
              <button 
                onClick={handleAddAdvantage}
                className={styles.addButton}
                disabled={!currentAdvantage.trim()}
              >
                +
              </button>
            </div>
            <ul className={styles.list}>
              {activeRecord.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Недостатки</h3>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={currentDisadvantage}
                onChange={(e) => setCurrentDisadvantage(e.target.value)}
                placeholder="Добавить недостаток..."
                className={styles.input}
              />
              <button 
                onClick={handleAddDisadvantage}
                className={styles.addButton}
                disabled={!currentDisadvantage.trim()}
              >
                +
              </button>
            </div>
            <ul className={styles.list}>
              {activeRecord.disadvantages.map((disadvantage, index) => (
                <li key={index}>{disadvantage}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div className={styles.recordsList}>
          <h3>Записанные мысли:</h3>
          <div className={styles.thoughts}>
            {records.map((record, index) => (
              <button
                key={index}
                className={`${styles.thoughtButton} ${activeRecord?.thought === record.thought ? styles.active : ''}`}
                onClick={() => setActiveRecord(record)}
              >
                {record.thought}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 
