import { useState } from 'react';
import styles from './SelfSupport.module.css';
import { SupportStatement } from './types';
import { v4 as uuidv4 } from 'uuid';

const SelfSupport = () => {
  const [statements, setStatements] = useState<SupportStatement[]>([]);
  const [newDevaluing, setNewDevaluing] = useState('');
  const [newSupporting, setNewSupporting] = useState('');

  const handleAddStatement = () => {
    if (!newDevaluing.trim()) return;

    const statement: SupportStatement = {
      id: uuidv4(),
      devaluing: newDevaluing,
      supporting: newSupporting
    };

    setStatements([...statements, statement]);
    setNewDevaluing('');
    setNewSupporting('');
  };

  const handleUpdateStatement = (id: string, field: 'devaluing' | 'supporting', value: string) => {
    setStatements(statements.map(statement =>
      statement.id === id ? { ...statement, [field]: value } : statement
    ));
  };

  const handleDeleteStatement = (id: string) => {
    setStatements(statements.filter(statement => statement.id !== id));
  };

  return (
    <div className={styles.container}>
      <h2>Самоподдержка</h2>
      
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.column}>Обесценивающее утверждение</div>
          <div className={styles.column}>Поддерживающее утверждение</div>
        </div>

        <div className={styles.statements}>
          {statements.map(statement => (
            <div key={statement.id} className={styles.row}>
              <div className={styles.column}>
                <textarea
                  value={statement.devaluing}
                  onChange={(e) => handleUpdateStatement(statement.id, 'devaluing', e.target.value)}
                  className={`${styles.textArea} ${styles.devaluingArea}`}
                />
              </div>
              <div className={styles.column}>
                <textarea
                  value={statement.supporting}
                  onChange={(e) => handleUpdateStatement(statement.id, 'supporting', e.target.value)}
                  className={`${styles.textArea} ${styles.supportingArea}`}
                />
                <button
                  onClick={() => handleDeleteStatement(statement.id)}
                  className={styles.deleteButton}
                  aria-label="Удалить утверждение"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.addRow}>
          <div className={styles.column}>
            <textarea
              value={newDevaluing}
              onChange={(e) => setNewDevaluing(e.target.value)}
              placeholder="Введите обесценивающее утверждение..."
              className={`${styles.textArea} ${styles.devaluingArea}`}
            />
          </div>
          <div className={styles.column}>
            <textarea
              value={newSupporting}
              onChange={(e) => setNewSupporting(e.target.value)}
              placeholder="Введите поддерживающее утверждение..."
              className={`${styles.textArea} ${styles.supportingArea}`}
            />
          </div>
        </div>

        <button onClick={handleAddStatement} className={styles.addButton}>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default SelfSupport; 
