import { useState } from 'react';
import styles from './NoButsSheet.module.css';
import { ButPair } from './types';
import { v4 as uuidv4 } from 'uuid';

const NoButsSheet = () => {
  const [pairs, setPairs] = useState<ButPair[]>([]);
  const [newBut, setNewBut] = useState('');
  const [newNoBut, setNewNoBut] = useState('');

  const handleAddPair = () => {
    if (!newBut.trim()) return;

    const pair: ButPair = {
      id: uuidv4(),
      but: newBut,
      noBut: newNoBut
    };

    setPairs([...pairs, pair]);
    setNewBut('');
    setNewNoBut('');
  };

  const handleUpdatePair = (id: string, field: 'but' | 'noBut', value: string) => {
    setPairs(pairs.map(pair =>
      pair.id === id ? { ...pair, [field]: value } : pair
    ));
  };

  const handleDeletePair = (id: string) => {
    setPairs(pairs.filter(pair => pair.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.thoughtsContainer}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>Ваше "но":</div>
          {pairs.map((pair, index) => (
            <div key={pair.id} className={styles.thoughtItem}>
              <textarea
                value={pair.but}
                onChange={(e) => handleUpdatePair(pair.id, 'but', e.target.value)}
                className={`${styles.textArea} ${styles.butArea}`}
              />
              <div className={styles.arrow}>→</div>
              {index < pairs.length - 1 && (
                <div className={styles.verticalArrow}>↓</div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.column}>
          <div className={styles.columnHeader}>Конструктивная альтернатива:</div>
          {pairs.map((pair) => (
            <div key={pair.id} className={styles.thoughtItem}>
              <textarea
                value={pair.noBut}
                onChange={(e) => handleUpdatePair(pair.id, 'noBut', e.target.value)}
                className={`${styles.textArea} ${styles.noButArea}`}
              />
              <button
                onClick={() => handleDeletePair(pair.id)}
                className={styles.deleteButton}
                aria-label="Удалить пару"
              >
                ✕
              </button>
             
            </div>
          ))}
        </div>
      </div>

      <div className={styles.addNewSection}>
        <div className={styles.addPair}>
          <div className={styles.inputGroup}>
            <textarea
              value={newBut}
              onChange={(e) => setNewBut(e.target.value)}
              placeholder="Опишите вашу отговорку или негативную мысль..."
              className={`${styles.textArea} ${styles.butArea}`}
            />
            
          </div>
          <div className={styles.inputGroup}>
            <textarea
              value={newNoBut}
              onChange={(e) => setNewNoBut(e.target.value)}
              placeholder="Замените негативную мысль на конструктивную альтернативу..."
              className={`${styles.textArea} ${styles.noButArea}`}
            />
          </div>
        </div>
        <button onClick={handleAddPair} className={styles.addButton}>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default NoButsSheet; 
