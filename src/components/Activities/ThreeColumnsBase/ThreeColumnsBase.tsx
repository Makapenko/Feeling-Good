import React, { useState, useMemo } from 'react';
import styles from './ThreeColumnsBase.module.css';
import { CognitiveDistortions } from '../ThoughtDiaryBase/CognitiveDistortions/CognitiveDistortions';
import { ThoughtRecord, ThreeColumnsMethodResult } from './types';
import { useDailyProgress } from '../../../redux/hooks';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getCurrentISOTimestamp } from '../../../utils/dateUtils';
import { getAllRecordsFromProgress } from '../../../utils/recordsUtils';
import { ACTIVITY_IDS } from '../../../constants/activities';

interface ThreeColumnsBaseProps {
  title: string;
  description: string;
  leftColumnTitle: string;
  leftColumnPlaceholder: string;
  rightColumnTitle: string;
  rightColumnPlaceholder: string;
  showCognitiveDistortions?: boolean;
  showMiddleColumn?: boolean;
  methodId: string;
  onSave?: (result: ThreeColumnsMethodResult) => void;
  actionButtons?: React.ReactNode;
  saveButtonDisabled?: boolean;
  saveButtonTooltip?: string;
  hideHistory?: boolean;
  allowPartialColumns?: boolean; // Позволяет добавлять только левую или только правую колонку
}

export const ThreeColumnsBase: React.FC<ThreeColumnsBaseProps> = ({
  title,
  description,
  leftColumnTitle,
  leftColumnPlaceholder,
  rightColumnTitle,
  rightColumnPlaceholder,
  showCognitiveDistortions = true,
  showMiddleColumn = true,
  methodId,
  onSave,
  actionButtons,
  saveButtonDisabled,
  saveButtonTooltip,
  hideHistory = false,
  allowPartialColumns = false, // По умолчанию требуем обе колонки
}) => {
  const [currentRecord, setCurrentRecord] = useState<Omit<ThoughtRecord, 'timestamp' | 'id'>>({
    leftColumn: '',
    cognitiveDistortion: [],
    rightColumn: '',
  });

  // Используем специализированный хук для получения прогресса
  const dailyProgress = useDailyProgress();

  // Собираем все записи метода, используя новую утилиту
  const allRecords = useMemo(() => {
    return getAllRecordsFromProgress<ThoughtRecord>(
      dailyProgress,
      [ACTIVITY_IDS.THREE_COLUMNS_METHOD, 
       ACTIVITY_IDS.NO_LOSE_TECHNIQUE, 
       ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS,
       ACTIVITY_IDS.HOT_COOL_THOUGHTS,
       ACTIVITY_IDS.REWRITE_SHOULD_RULES,
       ACTIVITY_IDS.RATIONAL_RESPONSES,
       ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES,
       ACTIVITY_IDS.VERBAL_JUDO,
       ACTIVITY_IDS.ANGER_PROS_CONS],
      methodId
    );
  }, [dailyProgress, methodId]);

  const handleAddRecord = () => {
    // Проверяем наличие данных в зависимости от режима
    const hasRequiredData = allowPartialColumns 
      ? (currentRecord.leftColumn || currentRecord.rightColumn) // Хотя бы одна колонка
      : (currentRecord.leftColumn && currentRecord.rightColumn); // Обе колонки
    
    if (hasRequiredData) {
      const newRecord: ThoughtRecord = {
        ...currentRecord,
        id: uuidv4(),
        timestamp: getCurrentISOTimestamp(),
      };

      // Получаем текущую дату
      const today = getCurrentDate();

      // Получаем существующие записи за сегодня
      const todayProgress = dailyProgress[today];
      let existingRecords: ThoughtRecord[] = [];

      if (todayProgress?.exercises?.exercises) {
        const exercise = todayProgress.exercises.exercises.find(
          ex => ex.id === methodId
        );

        if (exercise && 'records' in exercise) {
          existingRecords = exercise.records as ThoughtRecord[];
        }
      }

      // Объединяем существующие записи с новой
      const updatedRecords = [...existingRecords, newRecord];

      // Сохраняем результат
      if (onSave) {
        const result: ThreeColumnsMethodResult = {
          id: methodId,
          name: title,
          completed: true,
          completedAt: getCurrentISOTimestamp(),
          records: updatedRecords
        };
        onSave(result);
      }

      // Очищаем форму
      setCurrentRecord({
        leftColumn: '',
        cognitiveDistortion: [],
        rightColumn: '',
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        {actionButtons}
      </div>
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

        {showMiddleColumn && showCognitiveDistortions && (
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
        disabled={(() => {
          // Определяем, можно ли добавить запись в зависимости от режима
          const canAdd = allowPartialColumns 
            ? (currentRecord.leftColumn || currentRecord.rightColumn) // Хотя бы одна колонка
            : (currentRecord.leftColumn && currentRecord.rightColumn); // Обе колонки
          return !canAdd || saveButtonDisabled;
        })()}
        title={saveButtonTooltip}
      >
        Добавить запись
      </button>

      {!hideHistory && (
        <div className={styles.recordsList}>
          <table>
            <thead>
              <tr>
                <th>{leftColumnTitle}</th>
                {showMiddleColumn && showCognitiveDistortions && <th>Когнитивные искажения</th>}
                <th>{rightColumnTitle}</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.map((record) => (
                <tr key={record.id}>
                  <td data-label={leftColumnTitle}>{record.leftColumn}</td>
                  {showMiddleColumn && showCognitiveDistortions && (
                    <td data-label="Когнитивные искажения">{record.cognitiveDistortion.join(', ')}</td>
                  )}
                  <td data-label={rightColumnTitle}>{record.rightColumn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 
