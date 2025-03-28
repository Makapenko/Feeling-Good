import { useState, useMemo } from 'react';
import styles from './SelfSupport.module.css';
import { SupportStatement } from '../../../types/progress.types';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { getCurrentISOTimestamp, formatDate } from '../../../utils/dateUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID = ACTIVITY_IDS.SELF_SUPPORT;

const SelfSupport = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [statements, setStatements] = useState<SupportStatement[]>([]);
  const [newDevaluing, setNewDevaluing] = useState('');
  const [newSupporting, setNewSupporting] = useState('');

  // Получаем все записи из прогресса, используя новую утилиту
  const allStatements = useMemo(() => {
    return getAllRecordsFromProgress<SupportStatement>(
      dailyProgress,
      ACTIVITY_IDS.SELF_SUPPORT,
      SHEET_ID
    );
  }, [dailyProgress]);

  const saveToProgress = (updatedStatements: SupportStatement[]) => {
    dispatch(addExercise({
      exercise: {
        type: ACTIVITY_IDS.SELF_SUPPORT,
        id: SHEET_ID,
        name: ACTIVITY_NAMES[ACTIVITY_IDS.SELF_SUPPORT],
        completed: true,
        completedAt: getCurrentISOTimestamp(),
        records: updatedStatements.map(statement => ({
          ...statement,
          timestamp: getCurrentISOTimestamp()
        }))
      },
      showNotification: false
    }));
  };

  const handleAddStatement = () => {
    if (!newDevaluing.trim()) return;

    const statement: SupportStatement = {
      id: uuidv4(),
      devaluing: newDevaluing,
      supporting: newSupporting,
      timestamp: getCurrentISOTimestamp()
    };

    const updatedStatements = [...statements, statement];
    setStatements(updatedStatements);
    setNewDevaluing('');
    setNewSupporting('');
    saveToProgress(updatedStatements);
  };

  const handleUpdateStatement = (id: string, field: 'devaluing' | 'supporting', value: string) => {
    const updatedStatements = statements.map(statement =>
      statement.id === id ? { ...statement, [field]: value } : statement
    );
    setStatements(updatedStatements);
    saveToProgress(updatedStatements);
  };

  const handleDeleteStatement = (id: string) => {
    const updatedStatements = statements.filter(statement => statement.id !== id);
    setStatements(updatedStatements);
    saveToProgress(updatedStatements);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Самоподдержка</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div className={styles.description}>
        <p>
          Отслеживайте обесценивающие мысли и заменяйте их более объективными и поддерживающими.
          Оказывайте себе поддержку в течение дня даже в мелочах. Продолжайте практиковаться,
          и вы заметите, как улучшается настроение и растет гордость за свои достижения.
        </p>
      </div>

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
              </div>
              <button
                onClick={() => handleDeleteStatement(statement.id)}
                className={styles.deleteButton}
                aria-label="Удалить утверждение"
              >
                ✕
              </button>
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

      {allStatements.length > 0 && (
        <div className={styles.historicalStatements}>
          <h3>История записей</h3>
          <div className={styles.statementsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.dateColumn}>Дата</div>
              <div className={styles.devaluingColumn}>Обесценивающее утверждение</div>
              <div className={styles.arrowColumn}></div>
              <div className={styles.supportingColumn}>Поддерживающее утверждение</div>
            </div>
            <div className={styles.tableBody}>
              {allStatements.map((statement) => (
                <div key={statement.id} className={styles.tableRow}>
                  <div className={styles.dateColumn}>
                    {formatDate(statement.timestamp)}
                  </div>
                  <div className={styles.devaluingColumn}>
                    <p>{statement.devaluing}</p>
                  </div>
                  <div className={styles.arrowColumn}>
                    <div className={styles.arrow}>→</div>
                  </div>
                  <div className={styles.supportingColumn}>
                    <p>{statement.supporting}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfSupport; 
