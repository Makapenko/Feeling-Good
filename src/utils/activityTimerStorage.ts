interface ActivityTime {
  [activityId: string]: number;
}

interface DailyActivityProgress {
  [date: string]: ActivityTime;
}

const ACTIVITY_TIMER_STORAGE_KEY = 'activity_time';

// Получить все сохранённые данные
const getAllStoredData = (): DailyActivityProgress => {
  const storedData = localStorage.getItem(ACTIVITY_TIMER_STORAGE_KEY);
  if (!storedData) {
    return {};
  }

  try {
    const data = JSON.parse(storedData);
    return data;
  } catch (e) {
    console.error('Error parsing stored activity time data:', e);
    return {};
  }
};

// Сохранить все данные
const saveAllData = (data: DailyActivityProgress): void => {
  try {
    localStorage.setItem(ACTIVITY_TIMER_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving activity time data:', e);
  }
};

export const getStoredActivityTime = (activityId: string): number => {
  const today = new Date().toISOString().split('T')[0];
  const dailyProgress = getAllStoredData();
  return dailyProgress[today]?.[activityId] || 0;
};

export const saveActivityTime = (activityId: string, seconds: number): void => {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyProgress = getAllStoredData();

  // Обновляем время для текущей даты и активности
  dailyProgress[today] = {
    ...dailyProgress[today],
    [activityId]: seconds
  };

  saveAllData(dailyProgress);
}; 
