import React from 'react';
import { AngerProsConsExercise } from '../../Activities/AngerProsCons/types';
import ExerciseWrapper from './ExerciseWrapper';
import styles from '../DayDetails.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import { compareDatesDesc } from '../../../utils/dateUtils';

interface AngerProsConsExerciseProps {
  exercises: AngerProsConsExercise[]; // Теперь массив упражнений
  expandedExercises: string[];
  toggleExercise: (id: string) => void;
  onClose?: () => void;
}

/**
 * Компонент для отображения упражнения "Преимущества и недостатки гнева"
 * в календаре прогресса
 */
const AngerProsConsExerciseComponent: React.FC<AngerProsConsExerciseProps> = ({
  exercises,
  expandedExercises,
  toggleExercise,
  onClose
}) => {
  // Создаем виртуальный ID группы для переключения видимости
  const groupId = `anger-pros-cons-group-${exercises[0]?.id || ''}`;
  const isExpanded = expandedExercises.includes(groupId);
  
  // Если нет упражнений, не отображаем ничего
  if (!exercises || exercises.length === 0) {
    return null;
  }

  // Собираем все записи из всех упражнений
  const allRecords = exercises.flatMap(ex => 
    (ex.records || []).map(record => ({
      ...record,
      exerciseId: ex.id,
      completedAt: ex.completedAt
    }))
  );

  // Собираем все позитивные последствия из всех упражнений
  const allConsequences = exercises.flatMap(ex => 
    (ex.positiveConsequences || []).map(consequence => ({
      text: consequence,
      exerciseId: ex.id,
      completedAt: ex.completedAt
    }))
  );

  // Находим максимальную длину массивов
  const maxLength = Math.max(allRecords.length, allConsequences.length);

  // Если все массивы пустые, показываем сообщение
  if (maxLength === 0) {
    // Создаем базовое упражнение только с необходимыми полями для ExerciseWrapper
    const dummyExercise: AngerProsConsExercise = {
      id: groupId,
      type: ACTIVITY_IDS.ANGER_PROS_CONS,
      name: "Преимущества и недостатки гнева",
      completed: true,
      completedAt: exercises[0]?.completedAt || '',
      records: [],
      positiveConsequences: []
    };

    return (
      <ExerciseWrapper
        exercise={dummyExercise}
        expandedExercises={expandedExercises}
        toggleExercise={toggleExercise}
        onClose={onClose}
      >
        <div className={styles.emptyMessage}>В этих упражнениях нет записей</div>
      </ExerciseWrapper>
    );
  }

  // Функция для сортировки по дате (новые сверху), с учетом возможного отсутствия даты
  const sortByCompletedAtDesc = (
    a: { completedAt?: string },
    b: { completedAt?: string }
  ) => {
    if (a.completedAt && b.completedAt) {
      return compareDatesDesc(a.completedAt, b.completedAt);
    }
    if (a.completedAt) return -1;
    if (b.completedAt) return 1;
    return 0;
  };

  // Сортируем записи по времени выполнения
  const sortedRecords = [...allRecords].sort(sortByCompletedAtDesc);
  const sortedConsequences = [...allConsequences].sort(sortByCompletedAtDesc);

  // Создаем базовое упражнение только с необходимыми полями для ExerciseWrapper
  const groupedExercise: AngerProsConsExercise = {
    id: groupId,
    type: ACTIVITY_IDS.ANGER_PROS_CONS,
    name: "Преимущества и недостатки гнева",
    completed: true,
    completedAt: exercises[0]?.completedAt || '',
    records: [],
    positiveConsequences: []
  };

  return (
    <ExerciseWrapper
      exercise={groupedExercise}
      expandedExercises={expandedExercises}
      toggleExercise={toggleExercise}
      onClose={onClose}
    >
      {isExpanded && (
        <div>
          <table className={styles.exerciseTable}>
            <thead>
              <tr>
                <th>Преимущества</th>
                <th>Недостатки</th>
                <th>Критика гнева</th>
              </tr>
            </thead>
            <tbody>
              {/* Создаем массив из maxLength элементов для вывода строк таблицы */}
              {Array.from({ length: maxLength }).map((_, rowIndex) => {
                const record = sortedRecords[rowIndex];
                const consequence = sortedConsequences[rowIndex];
                
                return (
                  <tr key={rowIndex}>
                    <td>
                      {record ? record.leftColumn : ''}
                    </td>
                    <td>
                      {record ? record.rightColumn : ''}
                    </td>
                    <td>
                      {consequence ? consequence.text : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ExerciseWrapper>
  );
};

export default AngerProsConsExerciseComponent; 
