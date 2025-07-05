import React, { useState, useMemo } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { ThreeColumnsMethodResult, ThoughtRecord } from '../ThreeColumnsBase/types';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import styles from './AngerProsCons.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';
import { AngerProsConsExercise } from './types';
import { v4 as uuidv4 } from 'uuid';

// TODO: У компонента есть счетчик времени, который не работает, разобраться - нужен ли он, зачем и может его лучше скрыть

// Идентификатор активности
const SHEET_ID = ACTIVITY_IDS.ANGER_PROS_CONS;

const AngerProsCons: React.FC = () => {
  const dispatch = useAppDispatch();
  const [records, setRecords] = useState<ThoughtRecord[]>([]); // массив пар преимуществ/недостатков
  const [consequences, setConsequences] = useState<string[]>([]); // список "Что хорошего произойдет"
  const [consequenceInput, setConsequenceInput] = useState('');
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState<number>(0);

  // Получаем данные прогресса
  const dailyProgress = useDailyProgress();

  // Получаем историю прохождений - получаем сохраненные упражнения напрямую из dailyProgress
  const exerciseHistory = useMemo(() => {
    // Получаем все упражнения из всех дней
    const historyExercises: AngerProsConsExercise[] = [];
    
    if (dailyProgress) {
      // Проходим по всем дням
      Object.entries(dailyProgress).forEach(([date, day]) => {
        // Проверяем наличие упражнений за день
        if (day?.exercises?.exercises) {
          // Фильтруем упражнения по типу
          const angerProsConsExercises = day.exercises.exercises.filter(ex => 
            ex.type === SHEET_ID
          );
          
          // Добавляем найденные упражнения в общий массив
          angerProsConsExercises.forEach(ex => {
            // Проверяем, что это упражнение имеет нужную структуру
            if ('records' in ex && 'positiveConsequences' in ex) {
              const exercise = ex as AngerProsConsExercise;
              // Добавляем дату для отображения при сортировке
              historyExercises.push({
                ...exercise,
                // Добавляем дату записи, если она отсутствует
                date: date
              });
            }
          });
        }
      });
    }
    
    // Сортируем по дате (новые сверху)
    const sortedHistory = [...historyExercises].sort((a, b) => {
      // Сначала по дате завершения (если есть)
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      // Если нет даты завершения, используем дату из объекта
      return a.date && b.date ? b.date.localeCompare(a.date) : 0;
    });
    
    return sortedHistory;
  }, [dailyProgress, historyRefreshTrigger]);

  // Обработчик для записей из ThreeColumnsBase
  const handleThreeColumnsResult = (result: ThreeColumnsMethodResult) => {
    if (result && result.records && result.records.length > 0) {
      // Добавляем только новую запись к существующим
      const newRecord = result.records[result.records.length - 1];
      
      // Проверяем, что запись с таким id еще не существует
      if (!records.some(r => r.id === newRecord.id)) {
        const updatedRecords = [...records, newRecord];
        setRecords(updatedRecords);
      }
    }
  };

  // Добавить последствие
  const handleAddConsequence = () => {
    if (consequenceInput.trim()) {
      const newConsequences = [...consequences, consequenceInput.trim()];
      setConsequences(newConsequences);
      setConsequenceInput('');
    }
  };

  // Удалить последствие
  const handleRemoveConsequence = (idx: number) => {
    const newConsequences = consequences.filter((_, i) => i !== idx);
    setConsequences(newConsequences);
  };

  // Сохранить запись
  const handleSave = () => {
    if (!records.length || !consequences.length) {
      return;
    }

    // Генерируем уникальный ID для каждого нового упражнения
    const uniqueId = uuidv4();

    // Создаем новое упражнение со всеми данными и уникальным ID
    const exercise: AngerProsConsExercise = {
      ...createBaseExercise(SHEET_ID, uniqueId),
      records: [...records], // Копируем массив преимуществ/недостатков
      positiveConsequences: [...consequences], // Копируем массив последствий
      completedAt: getCurrentISOTimestamp(),
    };
    
    // Сохраняем упражнение в redux
    dispatch(addExercise({ exercise, showNotification: true }));
    
    // Очищаем все поля после сохранения
    setRecords([]); 
    setConsequences([]);
    setConsequenceInput('');
    
    // Обновляем триггер для обновления истории
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  // Можно ли сохранить - проверяем наличие записей и последствий
  // Записи могут содержать только левую или только правую колонку
  const canSave = records.length > 0 && consequences.length > 0;

  return (
    <div className={styles.stepContainer}>
      <ThreeColumnsBase
        title="Преимущества и недостатки гнева"
        description="В левой колонке перечислите все преимущества гнева и мстительного поведения (что вы получаете, когда злитесь). В правой колонке — все недостатки и потери от гнева (чего вы лишаетесь, когда злитесь). Будьте честны, учитывайте как краткосрочные, так и долгосрочные последствия. Можете заполнить только одну колонку, если у вас есть данные только для неё."
        leftColumnTitle="Преимущества гнева"
        leftColumnPlaceholder="Что я получаю, когда злюсь..."
        rightColumnTitle="Недостатки гнева"
        rightColumnPlaceholder="Чего я лишаюсь, когда злюсь..."
        showCognitiveDistortions={false}
        showMiddleColumn={false}
        methodId={SHEET_ID}
        hideHistory={true}
        allowPartialColumns={true} // Позволяем добавлять только левую или только правую колонку
        onSave={handleThreeColumnsResult}
        actionButtons={
          <>
            <ChapterLinkButton activityId={SHEET_ID} />
            <FavoriteButton activityId={SHEET_ID} />
          </>
        }
      />
      
      {/* Отображение текущих записанных преимуществ и недостатков */}
      {records.length > 0 && (
        <div className={styles.currentTable}>
          <h3>Ваши преимущества и недостатки гнева</h3>
          <table>
            <thead>
              <tr>
                <th>Преимущества</th>
                <th>Недостатки</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec.id || idx}>
                  <td>{rec.leftColumn || '-'}</td>
                  <td>{rec.rightColumn || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Список последствий */}
      <div className={styles.critiqueSection}>
        <h3>Что хорошего произойдет, если я стану менее гневливым?</h3>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={consequenceInput}
            onChange={e => setConsequenceInput(e.target.value)}
            placeholder="Например: Я стану спокойнее в семье"
          />
          <button onClick={handleAddConsequence}>Добавить</button>
        </div>
        <ul className={styles.list}>
          {consequences.map((item, idx) => (
            <li key={idx}>
              {item}
              <button className={styles.removeBtn} onClick={() => handleRemoveConsequence(idx)} title="Удалить">×</button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.actions}>
        <button onClick={handleSave} disabled={!canSave}>Сохранить запись</button>
      </div>
      
      {/* История всех прохождений */}
      <div className={styles.historySection}>
        <h3>История ваших записей</h3>
        {exerciseHistory.length === 0 ? (
          <p className={styles.emptyMsg}>История записей пуста</p>
        ) : (
          <div className={styles.historyTableContainer}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Дата/время</th>
                  <th>Преимущества</th>
                  <th>Недостатки</th>
                  <th>Критика гнева</th>
                </tr>
              </thead>
              <tbody>
                {exerciseHistory.map((entry, idx) => {
                  // Находим максимальную длину массивов
                  const recordsLength = entry.records?.length || 0;
                  const consequencesLength = entry.positiveConsequences?.length || 0;
                  const maxLength = Math.max(recordsLength, consequencesLength);
                  
                  // Создаем массив строк на основе максимальной длины
                  return Array.from({ length: maxLength }).map((_, rowIndex) => (
                    <tr key={`${entry.id || idx}-${rowIndex}`}>
                      {/* Объединяем ячейки по дате только для первой строки */}
                      {rowIndex === 0 && (
                        <td rowSpan={maxLength}>
                          {entry.completedAt ? new Date(entry.completedAt).toLocaleString('ru-RU') : 'Нет даты'}
                        </td>
                      )}
                      <td>
                        {entry.records && entry.records[rowIndex] 
                          ? entry.records[rowIndex].leftColumn || '-' 
                          : ''}
                      </td>
                      <td>
                        {entry.records && entry.records[rowIndex] 
                          ? entry.records[rowIndex].rightColumn || '-' 
                          : ''}
                      </td>
                      <td>
                        {entry.positiveConsequences && entry.positiveConsequences[rowIndex] 
                          ? entry.positiveConsequences[rowIndex] 
                          : ''}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngerProsCons; 
