import { DayProgress } from '../redux/types';
import { compareDatesDesc } from './dateUtils';

/**
 * Получает все записи указанного типа упражнения из прогресса пользователя
 * @param dailyProgress Прогресс пользователя по дням
 * @param exerciseType Тип упражнения или массив типов для фильтрации
 * @param exerciseId ID упражнения для фильтрации
 * @param filterFn Дополнительная функция фильтрации записей (опционально)
 * @returns Массив записей с добавленной датой, отсортированный по убыванию времени
 */
export function getAllRecordsFromProgress<T extends { timestamp?: string }>(
  dailyProgress: Record<string, DayProgress> | undefined,
  exerciseType: string | string[],
  exerciseId: string,
  filterFn?: (record: T) => boolean
): Array<T & { date: string }> {
  if (!dailyProgress) return [];

  const allRecords: Array<T & { date: string }> = [];
  const exerciseTypes = Array.isArray(exerciseType) ? exerciseType : [exerciseType];

  Object.entries(dailyProgress).forEach(([date, dayProgress]) => {
    if (!dayProgress?.exercises?.exercises) return;
    
    const exercises = dayProgress.exercises.exercises;
    
    exercises
      .filter(exercise => 
        exerciseTypes.includes(exercise.type) && 
        exercise.id === exerciseId
      )
      .forEach(exercise => {
        if ('records' in exercise && Array.isArray(exercise.records)) {
          const records = exercise.records as unknown as T[];
          const recordsWithDate = records
            .filter(record => !filterFn || filterFn(record))
            .map(record => ({ ...record, date } as T & { date: string }));
          
          allRecords.push(...recordsWithDate);
        }
      });
  });

  // Сортируем по дате и времени (новые сверху)
  return allRecords
    .filter(record => record.timestamp !== undefined)
    .sort((a, b) => compareDatesDesc(a.timestamp || '', b.timestamp || ''));
} 
