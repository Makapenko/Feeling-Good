// Типы для хранения времени по активностям и главам
import { getCurrentDate } from './dateUtils';

interface TimeData {
  [componentId: string]: number;
}

interface DailyTimeProgress {
  [date: string]: TimeData;
}

const UNIVERSAL_TIMER_STORAGE_KEY = 'universal_timer_data';

/**
 * Получить все сохранённые данные о времени из localStorage
 * @returns Объект с данными о времени по дням и компонентам
 */
const getAllStoredData = (): DailyTimeProgress => {
  const storedData = localStorage.getItem(UNIVERSAL_TIMER_STORAGE_KEY);
  if (!storedData) {
    return {};
  }

  try {
    const data = JSON.parse(storedData);
    return data;
  } catch (e) {
    console.error('Ошибка при чтении данных времени:', e);
    return {};
  }
};

/**
 * Сохранить все данные о времени в localStorage
 * @param data Объект с данными о времени по дням и компонентам
 */
const saveAllData = (data: DailyTimeProgress): void => {
  try {
    localStorage.setItem(UNIVERSAL_TIMER_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка при сохранении данных времени:', e);
  }
};

/**
 * Получить сохраненное время для определенного компонента за сегодня
 * @param componentId Идентификатор компонента (активности или главы)
 * @returns Количество секунд, проведенных в компоненте
 */
export const getStoredTime = (componentId: string): number => {
  const today = getCurrentDate();
  const dailyProgress = getAllStoredData();
  return dailyProgress[today]?.[componentId] || 0;
};

/**
 * Сохранить время, проведенное в определенном компоненте за сегодня
 * @param componentId Идентификатор компонента (активности или главы)
 * @param seconds Количество секунд, проведенных в компоненте
 */
export const saveTime = (componentId: string, seconds: number): void => {
  const today = getCurrentDate();
  
  const dailyProgress = getAllStoredData();

  // Обновляем время для текущей даты и компонента
  dailyProgress[today] = {
    ...dailyProgress[today],
    [componentId]: seconds
  };

  saveAllData(dailyProgress);
};

/**
 * Получить все записи времени за сегодняшний день
 * @returns Объект с данными о времени по всем компонентам за сегодня
 */
export const getAllTimeForToday = (): TimeData => {
  const today = getCurrentDate();
  const dailyProgress = getAllStoredData();
  return dailyProgress[today] || {};
}; 
