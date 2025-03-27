import React, { useState, useMemo } from 'react';
import styles from './ThreeColumnsBase.module.css';
import { CognitiveDistortions } from '../ThoughtDiary/CognitiveDistortions/CognitiveDistortions';
import { ThoughtRecord, ThreeColumnsMethodResult } from './types';
import { useDailyProgress } from '../../../redux/hooks';
import { v4 as uuidv4 } from 'uuid';
import { ThreeColumnsExercise, NoLoseTechniqueExercise, Exercise } from '../../../types/progress.types';
import ActivityTimer from '../ActivityTimer/ActivityTimer';
import { getCurrentDate, getCurrentISOTimestamp, compareDatesDesc } from '../../../utils/dateUtils';
// TODO - поправить верхний и нижний паддинги в таблице старых записей в мобильной версии

type ExerciseWithRecords = ThreeColumnsExercise | NoLoseTechniqueExercise;

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
  actionButtons?: React.ReactNode;
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
  onSave,
  actionButtons
}) => {
  const [currentRecord, setCurrentRecord] = useState<Omit<ThoughtRecord, 'timestamp' | 'id'>>({
    leftColumn: '',
    cognitiveDistortion: [],
    rightColumn: '',
  });

  // Используем специализированный хук для получения прогресса
  const dailyProgress = useDailyProgress();
  
  // Собираем все записи метода
  const allRecords = useMemo(() => {
    if (!dailyProgress) return [];
    
    const allDayRecords: Array<ThoughtRecord & { date: string }> = [];
    // TODO выделить в отдельную утилиту
    Object.entries(dailyProgress).forEach(([date, dayProgress]) => {
      if (dayProgress && dayProgress.exercises) {
        const exercises = dayProgress.exercises.exercises || [];
        exercises
          .filter((exercise: Exercise): exercise is ExerciseWithRecords => 
            (exercise.type === 'three-columns-method' || exercise.type === 'no-lose-technique') && 
            exercise.id === methodId
          )
          .forEach((exercise: ExerciseWithRecords) => {
            allDayRecords.push(...exercise.records.map(record => ({
              ...record,
              date
            })));
          });
      }
    });
    
    // Сортируем по дате и времени (новые сверху)
    return allDayRecords.sort((a, b) => compareDatesDesc(a.timestamp, b.timestamp));
  }, [dailyProgress, methodId]);

  const handleAddRecord = () => {
    if (currentRecord.leftColumn && currentRecord.rightColumn) {
      const newRecord: ThoughtRecord = {
        ...currentRecord,
        id: uuidv4(),
        timestamp: getCurrentISOTimestamp(),
      };

      // Получаем текущую дату
      const today = getCurrentDate();
      
      // Получаем существующие записи за сегодня
      const todayExercise = dailyProgress[today]?.exercises.exercises?.find(
        (exercise: Exercise): exercise is ExerciseWithRecords => 
          (exercise.type === 'three-columns-method' || exercise.type === 'no-lose-technique') && 
          exercise.id === methodId
      );
      
      // Объединяем существующие записи с новой
      const updatedRecords = todayExercise ? [...todayExercise.records, newRecord] : [newRecord];

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
      <ActivityTimer activityId={methodId} />
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
            {allRecords.map((record) => (
              <tr key={record.id}>
                <td data-label={leftColumnTitle}>{record.leftColumn}</td>
                {showCognitiveDistortions && (
                  <td data-label="Когнитивные искажения">{record.cognitiveDistortion.join(', ')}</td>
                )}
                <td data-label={rightColumnTitle}>{record.rightColumn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
