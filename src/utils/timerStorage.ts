import { getCurrentDate } from './dateUtils';

interface ChapterTime {
  [chapterId: string]: number;
}

interface DailyTimeProgress {
  [date: string]: ChapterTime;
}

const TIMER_STORAGE_KEY = 'chapter_reading_time';

// Получить все сохранённые данные
const getAllStoredData = (): DailyTimeProgress => {
  const storedData = localStorage.getItem(TIMER_STORAGE_KEY);
  if (!storedData) {
    console.log('No stored data found');
    return {};
  }

  try {
    const data = JSON.parse(storedData);
    console.log('Retrieved stored data:', data);
    return data;
  } catch (e) {
    console.error('Error parsing stored data:', e);
    return {};
  }
};

// Сохранить все данные
const saveAllData = (data: DailyTimeProgress): void => {
  try {
    console.log('Saving data:', data);
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

export const getStoredTime = (chapterId: string): number => {
  const today = getCurrentDate();
  const dailyProgress = getAllStoredData();
  const time = dailyProgress[today]?.[chapterId] || 0;
  console.log(`Getting stored time for chapter ${chapterId} on ${today}:`, time);
  return time;
};

export const saveTime = (chapterId: string, seconds: number): void => {
  const today = getCurrentDate();
  console.log(`Saving time for chapter ${chapterId} on ${today}:`, seconds);
  
  const dailyProgress = getAllStoredData();

  // Обновляем время для текущей даты и главы
  dailyProgress[today] = {
    ...dailyProgress[today],
    [chapterId]: seconds
  };

  saveAllData(dailyProgress);
}; 
