import React, { useState, useMemo } from 'react';
import styles from './ThreeColumnsBase.module.css';
import { CognitiveDistortions } from '../ThoughtDiary/CognitiveDistortions/CognitiveDistortions';
import { ThoughtRecord, ThreeColumnsMethodResult } from './types';
import { useProgress } from '../../../store/ProgressContext';
import { v4 as uuidv4 } from 'uuid';
import { ThreeColumnsExercise, NoLoseTechniqueExercise } from '../../../types/progress.types';
import ActivityTimer from '../ActivityTimer/ActivityTimer';
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
  const [currentRecord, setCurrentRecord] = useState<Omit<ThoughtRecord, 'timestamp' | 'id'>>({
    leftColumn: '',
    cognitiveDistortion: [],
    rightColumn: '',
  });

  // Получаем все записи из прогресса
  const { progress } = useProgress();
  
  // Собираем все записи метода
  const allRecords = useMemo(() => {
    if (!progress?.dailyProgress) return [];
    
    const allDayRecords: Array<ThoughtRecord & { date: string }> = [];
    
    Object.entries(progress.dailyProgress).forEach(([date, dayProgress]) => {
      const exercises = dayProgress.exercises.exercises || [];
      exercises
        .filter((exercise): exercise is ExerciseWithRecords => 
          (exercise.type === 'three-columns-method' || exercise.type === 'no-lose-technique') && 
          exercise.id === methodId
        )
        .forEach(exercise => {
          allDayRecords.push(...exercise.records.map(record => ({
            ...record,
            date
          })));
        });
    });
    
    // Сортируем по дате и времени (новые сверху)
    return allDayRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [progress, methodId]);

  const handleAddRecord = () => {
    if (currentRecord.leftColumn && currentRecord.rightColumn) {
      const newRecord: ThoughtRecord = {
        ...currentRecord,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };

      // Получаем текущую дату
      const today = new Date().toISOString().split('T')[0];
      
      // Получаем существующие записи за сегодня
      const todayExercise = progress?.dailyProgress[today]?.exercises.exercises?.find(
        (exercise): exercise is ExerciseWithRecords => 
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
          completedAt: new Date().toISOString(),
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
