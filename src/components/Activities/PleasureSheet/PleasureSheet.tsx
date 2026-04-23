import { useState, useMemo } from 'react';
import styles from './PleasureSheet.module.css';
import { ACTIVITY_IDS, ActivityId } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { Activity, PleasureSheetExercise } from './types';
import { useAppDispatch, useDailyProgress } from '../../../redux/hooks';
import { addExercise } from '../../../redux/actions';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getCurrentISOTimestamp, formatDate, compareDatesDesc } from '../../../utils/dateUtils';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface PleasureSheetProps {
  activityId?: ActivityId;
  title?: string;
  description?: string;
  activityLabel?: string;
  activityPlaceholder?: string;
  participantsLabel?: string;
  participantsPlaceholder?: string;
}

const PleasureSheet: React.FC<PleasureSheetProps> = ({
  activityId = ACTIVITY_IDS.PLEASURE_SHEET,
  title = 'Листок предполагаемого удовольствия',
  description = 'Запишите занятие, вызывающее удовлетворенность, с кем вы это делали и оцените предполагаемый уровень удовольствия перед занятием. После занятия запишите реальный уровень удовольствия.',
  activityLabel = 'Занятие, вызывающее удовлетворенность (удовольствие или компетентность)',
  activityPlaceholder = 'Чем вы будете заниматься?',
  participantsLabel = 'С кем вы это делали?',
  participantsPlaceholder = 'Если в одиночку, укажите "Я"',
}) => {
  const dispatch = useAppDispatch();
  const dailyProgress = useDailyProgress();
  
  // Состояние формы для добавления новой записи
  const [activityText, setActivityText] = useState('');
  const [participants, setParticipants] = useState('');
  const [expectedPleasure, setExpectedPleasure] = useState(50);
  const [activityDate, setActivityDate] = useState(getCurrentDate());
  
  // Состояние для модального окна подтверждения удаления
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  
  // Состояние для редактирования записей в таблице
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Activity | null>(null);
  
  // Получаем все записи из истории
  const records = useMemo(() => {
    const exercises = Object.values(dailyProgress)
      .flatMap(day => day.exercises.exercises)
      .filter(ex => ex.type === activityId) as PleasureSheetExercise[];
    
    if (!exercises.length) return [];
    
    // Собираем все записи из этих упражнений
    const allRecords = exercises.flatMap(ex => ex.records);
    
    // Сортируем по дате (новые сверху)
    return [...allRecords].sort((a, b) => compareDatesDesc(a.date, b.date));
  }, [dailyProgress, activityId]);
  
  // Расчёт статистики
  const statistics = useMemo(() => {
    if (records.length === 0) {
      return {
        avgExpected: 0,
        avgActual: 0,
        avgDifference: 0,
        completedCount: 0
      };
    }
    
    // Только завершенные записи для расчета статистики
    const completedRecords = records.filter(r => r.completed);
    
    if (completedRecords.length === 0) {
      return {
        avgExpected: 0,
        avgActual: 0,
        avgDifference: 0,
        completedCount: 0
      };
    }
    
    const sumExpected = completedRecords.reduce((sum, record) => sum + record.expectedPleasure, 0);
    const sumActual = completedRecords.reduce((sum, record) => sum + record.actualPleasure, 0);
    const avgExpected = sumExpected / completedRecords.length;
    const avgActual = sumActual / completedRecords.length;
    const avgDifference = avgActual - avgExpected;
    
    return {
      avgExpected: Math.round(avgExpected),
      avgActual: Math.round(avgActual),
      avgDifference: Math.round(avgDifference),
      completedCount: completedRecords.length
    };
  }, [records]);
  
  // Создание новой записи
  const handleCreateActivity = () => {
    if (!activityText.trim()) return;
    
    const newActivity: Activity = {
      id: uuidv4(),
      text: activityText.trim(),
      participants: participants.trim() || 'Я',
      expectedPleasure,
      actualPleasure: 0,
      timestamp: getCurrentISOTimestamp(),
      date: activityDate,
      completed: false
    };
    
    const newRecords = [newActivity, ...records];
    saveToRedux(newRecords);
    
    // Сброс формы
    setActivityText('');
    setParticipants('');
    setExpectedPleasure(50);
    setActivityDate(getCurrentDate());
  };
  
  // Редактирование записи
  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditData({...activity});
  };
  
  // Сохранение отредактированной записи
  const saveEdit = () => {
    if (!editData) return;
    
    const updatedRecords = records.map(record => 
      record.id === editData.id ? editData : record
    );
    
    saveToRedux(updatedRecords);
    setEditingId(null);
    setEditData(null);
  };
  
  // Сохранение фактического удовольствия
  const saveActualPleasure = (id: string, actualPleasure: number) => {
    const updatedRecords = records.map(record => 
      record.id === id ? { ...record, actualPleasure, completed: true } : record
    );
    
    saveToRedux(updatedRecords);
  };
  
  // Удаление записи
  const deleteActivity = (id: string) => {
    setConfirmMessage('Вы уверены, что хотите удалить эту запись?');
    setConfirmAction(() => () => {
      const updatedRecords = records.filter(record => record.id !== id);
      saveToRedux(updatedRecords);
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };
  
  // Очистка всей истории
  const clearAllHistory = () => {
    setConfirmMessage('Вы уверены, что хотите удалить все записи? Это действие нельзя отменить.');
    setConfirmAction(() => () => {
      saveToRedux([]);
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };
  
  // Сохранение в Redux
  const saveToRedux = (updatedRecords: Activity[]) => {
    const exercise: PleasureSheetExercise = {
      ...createBaseExercise(activityId),
      records: updatedRecords
    };
    
    dispatch(addExercise({
      exercise,
      showNotification: false
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={activityId} />
          <FavoriteButton activityId={activityId} />
        </div>
      </div>

      <div className={styles.description}>
        <p>{description}</p>
      </div>
      
      {/* Форма добавления новой записи */}
      <form 
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateActivity();
        }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="activityDate">Дата</label>
          <input
            type="date"
            id="activityDate"
            className={styles.input}
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="activityText">{activityLabel}</label>
          <input
            type="text"
            id="activityText"
            className={styles.input}
            value={activityText}
            onChange={(e) => setActivityText(e.target.value)}
            placeholder={activityPlaceholder}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="participants">{participantsLabel}</label>
          <input
            type="text"
            id="participants"
            className={styles.input}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder={participantsPlaceholder}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="expectedPleasure">
            Предполагаемый уровень удовлетворения. Укажите перед занятием:
          </label>
          <div className={styles.rangeContainer}>
            <span className={styles.rangeValue}>{expectedPleasure}%</span>
            <input
              type="range"
              id="expectedPleasure"
              className={styles.range}
              min="0"
              max="100"
              step="5"
              value={expectedPleasure}
              onChange={(e) => setExpectedPleasure(parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <button type="submit" className={styles.button}>Добавить занятие</button>
      </form>
      
      {/* Статистика */}
      <div className={styles.stats}>
        <h3>Статистика</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statTitle}>Среднее предполагаемое удовольствие</p>
            <p className={styles.statValue}>{statistics.avgExpected}%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statTitle}>Среднее фактическое удовольствие</p>
            <p className={styles.statValue}>{statistics.avgActual}%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statTitle}>Средняя разница</p>
            <p className={styles.statValue}>{statistics.avgDifference > 0 ? '+' : ''}{statistics.avgDifference}%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statTitle}>Завершенных занятий</p>
            <p className={styles.statValue}>{statistics.completedCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {records.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Занятие</th>
                  <th>С кем</th>
                  <th>Предполагаемое удовольствие</th>
                  <th>Фактическое удовольствие</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {records.map(activity => (
                  <tr key={activity.id}>
                    <td>
                      {editingId === activity.id ? (
                        <input
                          type="date"
                          className={styles.input}
                          value={editData?.date || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, date: e.target.value} : null)}
                        />
                      ) : formatDate(activity.date)}
                    </td>
                    <td>
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          className={styles.input}
                          value={editData?.text || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, text: e.target.value} : null)}
                        />
                      ) : activity.text}
                    </td>
                    <td>
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          className={styles.input}
                          value={editData?.participants || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, participants: e.target.value} : null)}
                        />
                      ) : activity.participants}
                    </td>
                    <td>
                      {editingId === activity.id ? (
                        <div className={styles.rangeContainer}>
                          <input
                            type="range"
                            className={styles.range}
                            min="0"
                            max="100"
                            step="5"
                            value={editData?.expectedPleasure || 0}
                            onChange={(e) => setEditData(prev => prev ? {...prev, expectedPleasure: parseInt(e.target.value)} : null)}
                          />
                          <span className={styles.rangeValue}>{editData?.expectedPleasure || 0}%</span>
                        </div>
                      ) : `${activity.expectedPleasure}%`}
                    </td>
                    <td>
                      {editingId === activity.id ? (
                        <div className={styles.rangeContainer}>
                          <span className={styles.rangeValue}>{editData?.actualPleasure || 0}%</span>
                          <input
                            type="range"
                            className={styles.range}
                            min="0"
                            max="100"
                            step="5"
                            value={editData?.actualPleasure || 0}
                            onChange={(e) => setEditData(prev => prev ? {...prev, actualPleasure: parseInt(e.target.value), completed: true} : null)}
                          />
                        </div>
                      ) : activity.completed ? (
                        `${activity.actualPleasure}%`
                      ) : (
                        <div className={styles.rangeContainer}>
                          <span className={styles.rangeValue}>{activity.actualPleasure}%</span>
                          <input
                            type="range"
                            className={styles.range}
                            min="0"
                            max="100"
                            step="5"
                            value={activity.actualPleasure}
                            onChange={(e) => {
                              const updatedActivity = {...activity, actualPleasure: parseInt(e.target.value)};
                              const updatedRecords = records.map(record => 
                                record.id === activity.id ? updatedActivity : record
                              );
                              saveToRedux(updatedRecords);
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {editingId === activity.id ? (
                          <button
                            className={`${styles.iconButton} ${styles.saveButton}`}
                            onClick={saveEdit}
                            title="Сохранить"
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                        ) : (
                          <>
                            {!activity.completed && (
                              <button
                                className={`${styles.iconButton} ${styles.saveButton}`}
                                onClick={() => saveActualPleasure(activity.id, activity.actualPleasure)}
                                title="Записать фактическое удовольствие"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                            <button
                              className={`${styles.iconButton} ${styles.editButton}`}
                              onClick={() => startEdit(activity)}
                              title="Изменить"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className={`${styles.iconButton} ${styles.deleteButton}`}
                              onClick={() => deleteActivity(activity.id)}
                              title="Удалить"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              className={`${styles.button} ${styles.dangerButton}`}
              onClick={clearAllHistory}
            >
              Очистить всю историю
            </button>
          </>
        ) : (
          <div className={styles.emptyMessage}>
            <p>У вас пока нет записей. Добавьте первое занятие!</p>
          </div>
        )}
      </div>
      
      {/* Модальное окно подтверждения */}
      {showConfirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Подтверждение</h3>
            <p>{confirmMessage}</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.button}
                onClick={() => setShowConfirmModal(false)}
              >
                Отмена
              </button>
              <button 
                className={`${styles.button} ${styles.dangerButton}`}
                onClick={() => confirmAction()}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PleasureSheet; 
