import { RootState } from '../redux/types';
import { getCurrentDate } from './dateUtils';

/**
 * Результат расчета серии активности
 */
export interface StreakInfo {
  currentStreak: number; // Текущая серия дней подряд
  longestStreak: number; // Самая длинная серия за все время
  totalActiveDays: number; // Всего активных дней
  lastActivityDate: string | null; // Дата последней активности
}

/**
 * Проверяет, был ли день активным (есть ли упражнения или прочитанные главы)
 */
const isDayActive = (dayProgress: {
  exercises: { exercises: unknown[]; testResults: unknown[] };
  chapters: Record<string, unknown>;
}): boolean => {
  const hasExercises = dayProgress.exercises?.exercises?.length > 0;
  const hasTests = dayProgress.exercises?.testResults?.length > 0;
  const hasChapters = Object.keys(dayProgress.chapters || {}).length > 0;

  return hasExercises || hasTests || hasChapters;
};

/**
 * Вычисляет текущую серию активных дней
 */
export const calculateCurrentStreak = (state: RootState): number => {
  const { dailyProgress } = state.progress;
  const today = getCurrentDate();

  // Получаем все даты и сортируем их в обратном порядке (от новых к старым)
  const sortedDates = Object.keys(dailyProgress).sort((a, b) => b.localeCompare(a));

  let streak = 0;
  let expectedDate = today;

  for (const date of sortedDates) {
    // Если дата не совпадает с ожидаемой, прерываем серию
    if (date !== expectedDate) {
      break;
    }

    const dayData = dailyProgress[date];
    if (!dayData || !isDayActive(dayData)) {
      break;
    }

    streak++;

    // Переходим к предыдущему дню
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    expectedDate = currentDate.toISOString().split('T')[0];
  }

  return streak;
};

/**
 * Вычисляет самую длинную серию активных дней за все время
 */
export const calculateLongestStreak = (state: RootState): number => {
  const { dailyProgress } = state.progress;

  // Получаем все даты и сортируем их
  const sortedDates = Object.keys(dailyProgress).sort((a, b) => a.localeCompare(b));

  if (sortedDates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const dayData = dailyProgress[dateStr];
    if (!isDayActive(dayData)) {
      currentStreak = 0;
      previousDate = null;
      continue;
    }

    const currentDate = new Date(dateStr);

    if (previousDate === null) {
      // Первый активный день
      currentStreak = 1;
    } else {
      // Проверяем, следующий ли это день
      const dayDiff = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        // Следующий день подряд
        currentStreak++;
      } else {
        // Прервалась серия
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    previousDate = currentDate;
  }

  return longestStreak;
};

/**
 * Подсчитывает общее количество активных дней
 */
export const calculateTotalActiveDays = (state: RootState): number => {
  const { dailyProgress } = state.progress;

  return Object.values(dailyProgress).filter(isDayActive).length;
};

/**
 * Получает дату последней активности
 */
export const getLastActivityDate = (state: RootState): string | null => {
  const { dailyProgress } = state.progress;

  const sortedDates = Object.keys(dailyProgress)
    .sort((a, b) => b.localeCompare(a))
    .filter(date => isDayActive(dailyProgress[date]));

  return sortedDates[0] || null;
};

/**
 * Получает полную информацию о сериях активности пользователя
 */
export const getStreakInfo = (state: RootState): StreakInfo => {
  return {
    currentStreak: calculateCurrentStreak(state),
    longestStreak: calculateLongestStreak(state),
    totalActiveDays: calculateTotalActiveDays(state),
    lastActivityDate: getLastActivityDate(state)
  };
};

/**
 * Проверяет, активен ли пользователь сегодня
 */
export const isActiveToday = (state: RootState): boolean => {
  const today = getCurrentDate();
  const todayProgress = state.progress.dailyProgress[today];

  return todayProgress ? isDayActive(todayProgress) : false;
};

/**
 * Получает мотивационное сообщение в зависимости от длины серии
 */
export const getStreakMotivationalMessage = (streak: number): string => {
  if (streak === 0) {
    return 'Начните свою серию сегодня!';
  } else if (streak === 1) {
    return 'Отличное начало! Продолжайте завтра!';
  } else if (streak < 7) {
    return `Продолжайте в том же духе! ${streak} дней подряд!`;
  } else if (streak < 14) {
    return `Впечатляюще! Вы активны уже ${streak} дней!`;
  } else if (streak < 30) {
    return `Невероятно! ${streak} дней подряд! Вы на верном пути!`;
  } else if (streak < 100) {
    return `🔥 Потрясающе! ${streak} дней! Вы формируете сильную привычку!`;
  } else {
    return `🏆 ЛЕГЕНДА! ${streak} дней подряд! Вы вдохновляете!`;
  }
};
