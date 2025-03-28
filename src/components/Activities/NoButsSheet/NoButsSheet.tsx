import { useState, useMemo } from 'react';
import styles from './NoButsSheet.module.css';
import { ButPair } from './types';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { NoButsExercise } from '../../../types/progress.types';
import { getCurrentISOTimestamp, formatDate } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';

const SHEET_ID = ACTIVITY_IDS.NO_BUTS;

const NoButsSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  const [pairs, setPairs] = useState<ButPair[]>([]);
  const [newBut, setNewBut] = useState('');
  const [newNoBut, setNewNoBut] = useState('');

  // Получаем все записи из прогресса с использованием новой утилиты
  const allPairs = useMemo(() => {
    return getAllRecordsFromProgress<ButPair>(
      dailyProgress,
      ACTIVITY_IDS.NO_BUTS,
      SHEET_ID
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [dailyProgress]);

  const saveToProgress = (updatedPairs: ButPair[]) => {
    const exercise: NoButsExercise = {
      ...createBaseExercise(SHEET_ID),
      records: updatedPairs.map(pair => ({
        ...pair,
        timestamp: getCurrentISOTimestamp()
      }))
    };
    
    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  const handleAddPair = () => {
    if (!newBut.trim()) return;

    const pair: ButPair = {
      id: uuidv4(),
      but: newBut,
      noBut: newNoBut,
      timestamp: getCurrentISOTimestamp()
    };

    const updatedPairs = [...pairs, pair];
    setPairs(updatedPairs);
    setNewBut('');
    setNewNoBut('');
    saveToProgress(updatedPairs);
  };

  const handleUpdatePair = (id: string, field: 'but' | 'noBut', value: string) => {
    const updatedPairs = pairs.map(pair =>
      pair.id === id ? { ...pair, [field]: value } : pair
    );
    setPairs(updatedPairs);
    saveToProgress(updatedPairs);
  };

  const handleDeletePair = (id: string) => {
    const updatedPairs = pairs.filter(pair => pair.id !== id);
    setPairs(updatedPairs);
    saveToProgress(updatedPairs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Техника «Никаких но»</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div className={styles.description}>
        <p>
          Метод "Никаких но" поможет вам преодолеть самооправдания и отговорки, которые мешают действовать.
          Запишите ваше "но" - отговорку или негативную мысль, а затем найдите конструктивную альтернативу,
          которая поможет вам двигаться вперёд.
        </p>
      </div>

      <div className={styles.thoughtsContainer}>
        {pairs.map((pair, index) => (
          <div key={pair.id} className={styles.thoughtItem}>
            <button
              onClick={() => handleDeletePair(pair.id)}
              className={styles.deleteButton}
              aria-label="Удалить пару"
            >
              ✕
            </button>
            <div className={styles.butSection}>
              <textarea
                value={pair.but}
                onChange={(e) => handleUpdatePair(pair.id, 'but', e.target.value)}
                className={`${styles.textArea} ${styles.butArea}`}
              />
            </div>
            <div className={styles.thoughtArrow}>
              <div className={styles.arrow}>→</div>
            </div>
            <div className={styles.noButSection}>
              <textarea
                value={pair.noBut}
                onChange={(e) => handleUpdatePair(pair.id, 'noBut', e.target.value)}
                className={`${styles.textArea} ${styles.noButArea}`}
              />
            </div>
            {index < pairs.length - 1 && (
              <div className={styles.verticalArrow}>↓</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.addNewSection}>
        <div className={styles.addPair}>
          <div className={styles.inputGroup} data-label="Ваше 'но':">
            <textarea
              value={newBut}
              onChange={(e) => setNewBut(e.target.value)}
              placeholder="Опишите вашу отговорку или негативную мысль..."
              className={`${styles.textArea} ${styles.butArea}`}
            />
          </div>
          <div className={styles.inputGroup} data-label="Конструктивная альтернатива:">
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

      {allPairs.length > 0 && (
        <div className={styles.historicalPairs}>
          <h3>История записей</h3>
          <div className={styles.pairsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.dateColumn}>Дата</div>
              <div className={styles.butColumn}>Отговорка</div>
              <div className={styles.arrowColumn}></div>
              <div className={styles.noButColumn}>Альтернатива</div>
            </div>
            <div className={styles.tableBody}>
              {allPairs.map((pair) => (
                <div key={pair.id} className={styles.tableRow}>
                  <div className={styles.dateColumn}>
                    {formatDate(pair.timestamp)}
                  </div>
                  <div className={styles.butColumn}>
                    <p>{pair.but}</p>
                  </div>
                  <div className={styles.arrowColumn}>
                    <div className={styles.arrowHistory}>→</div>
                  </div>
                  <div className={styles.noButColumn}>
                    <p>{pair.noBut}</p>
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

export default NoButsSheet;
