import { ActivityId, ACTIVITY_NAMES } from '../constants/activities';
import { BaseExercise } from '../types/progress.types';
import { getCurrentISOTimestamp } from './dateUtils';

/**
 * Создает базовые поля упражнения на основе идентификатора активности.
 * Этот хелпер позволяет избежать дублирования кода при создании упражнений.
 * 
 * @param sheetId - ID активности (упражнения)
 * @param customId - Опциональный пользовательский ID (по умолчанию используется sheetId)
 * @returns Объект с базовыми полями для упражнения
 */
export const createBaseExercise = (sheetId: ActivityId, customId?: string): BaseExercise => {
  return {
    type: sheetId,
    id: customId || sheetId,
    name: ACTIVITY_NAMES[sheetId],
    completed: true,
    completedAt: getCurrentISOTimestamp()
  };
}; 
