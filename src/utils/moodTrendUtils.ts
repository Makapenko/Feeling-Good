import { RootState } from '../redux/types';
import { ACTIVITY_IDS } from '../constants/activities';

/**
 * Точка данных для графика настроения
 */
export interface MoodDataPoint {
  date: string; // ISO date string
  score: number; // Балл по шкале Бернса
  maxScore: number; // Максимальный балл (обычно 60)
  timestamp: string; // ISO timestamp
  interpretation: string; // Интерпретация уровня депрессии
}

/**
 * Диапазоны интерпретации по шкале Бернса
 */
const BURNS_INTERPRETATION_RANGES = {
  minimal: { max: 5, label: 'Минимальная или отсутствует', color: '#28a745' },
  mild: { max: 10, label: 'Легкая депрессия', color: '#90EE90' },
  moderate: { max: 25, label: 'Умеренная депрессия', color: '#ffc107' },
  severe: { max: 45, label: 'Тяжелая депрессия', color: '#fd7e14' },
  extreme: { max: Infinity, label: 'Крайне тяжелая депрессия', color: '#dc3545' }
};

/**
 * Получает интерпретацию балла по шкале Бернса
 */
export const getBurnsInterpretation = (score: number): { label: string; color: string } => {
  if (score <= BURNS_INTERPRETATION_RANGES.minimal.max) {
    return {
      label: BURNS_INTERPRETATION_RANGES.minimal.label,
      color: BURNS_INTERPRETATION_RANGES.minimal.color
    };
  } else if (score <= BURNS_INTERPRETATION_RANGES.mild.max) {
    return {
      label: BURNS_INTERPRETATION_RANGES.mild.label,
      color: BURNS_INTERPRETATION_RANGES.mild.color
    };
  } else if (score <= BURNS_INTERPRETATION_RANGES.moderate.max) {
    return {
      label: BURNS_INTERPRETATION_RANGES.moderate.label,
      color: BURNS_INTERPRETATION_RANGES.moderate.color
    };
  } else if (score <= BURNS_INTERPRETATION_RANGES.severe.max) {
    return {
      label: BURNS_INTERPRETATION_RANGES.severe.label,
      color: BURNS_INTERPRETATION_RANGES.severe.color
    };
  } else {
    return {
      label: BURNS_INTERPRETATION_RANGES.extreme.label,
      color: BURNS_INTERPRETATION_RANGES.extreme.color
    };
  }
};

/**
 * Извлекает данные о настроении из всех результатов тестов Бернса
 */
export const getMoodTrendData = (state: RootState): MoodDataPoint[] => {
  const { dailyProgress } = state.progress;
  const moodData: MoodDataPoint[] = [];

  // Проходим по всем дням
  Object.entries(dailyProgress).forEach(([date, dayData]) => {
    if (!dayData.exercises?.testResults) return;

    // Находим результаты теста Бернса за этот день
    dayData.exercises.testResults.forEach((test: any) => {
      // Проверяем, что это тест Бернса с необходимыми полями
      if (
        test.type !== ACTIVITY_IDS.BURNS_CHECKLIST ||
        typeof test.score !== 'number' ||
        typeof test.maxScore !== 'number'
      ) {
        return;
      }

      const interpretation = getBurnsInterpretation(test.score);
      moodData.push({
        date: date,
        score: test.score,
        maxScore: test.maxScore,
        timestamp: test.completedAt,
        interpretation: interpretation.label
      });
    });
  });

  // Сортируем по timestamp
  return moodData.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

/**
 * Получает последний результат теста Бернса
 */
export const getLatestBurnsScore = (state: RootState): MoodDataPoint | null => {
  const moodData = getMoodTrendData(state);
  return moodData.length > 0 ? moodData[moodData.length - 1] : null;
};

/**
 * Вычисляет изменение настроения (разница между первым и последним тестом)
 */
export const getMoodImprovement = (state: RootState): number | null => {
  const moodData = getMoodTrendData(state);
  if (moodData.length < 2) return null;

  const firstScore = moodData[0].score;
  const lastScore = moodData[moodData.length - 1].score;

  return firstScore - lastScore; // Положительное = улучшение, отрицательное = ухудшение
};

/**
 * Вычисляет средний балл за указанный период
 */
export const getAverageMoodScore = (
  state: RootState,
  days?: number
): number | null => {
  const moodData = getMoodTrendData(state);
  if (moodData.length === 0) return null;

  let dataToAnalyze = moodData;

  // Фильтруем по периоду, если указан
  if (days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = cutoffDate.toISOString();

    dataToAnalyze = moodData.filter(d => d.timestamp >= cutoffTimestamp);
  }

  if (dataToAnalyze.length === 0) return null;

  const sum = dataToAnalyze.reduce((acc, d) => acc + d.score, 0);
  return Math.round((sum / dataToAnalyze.length) * 10) / 10; // Округляем до 1 знака
};

/**
 * Получает тренд настроения (улучшается/ухудшается/стабильно)
 */
export const getMoodTrend = (state: RootState): 'improving' | 'worsening' | 'stable' | null => {
  const moodData = getMoodTrendData(state);
  if (moodData.length < 3) return null;

  // Берем последние 3 результата
  const recentData = moodData.slice(-3);

  const firstScore = recentData[0].score;
  const lastScore = recentData[recentData.length - 1].score;

  const difference = firstScore - lastScore;

  // Порог для определения стабильности (5 баллов)
  if (Math.abs(difference) < 5) return 'stable';

  return difference > 0 ? 'improving' : 'worsening';
};

/**
 * Форматирует данные для Recharts (Line chart)
 */
export const formatMoodDataForChart = (moodData: MoodDataPoint[]) => {
  return moodData.map((point, index) => {
    const interpretation = getBurnsInterpretation(point.score);
    return {
      name: new Date(point.date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short'
      }),
      score: point.score,
      maxScore: point.maxScore,
      date: point.date,
      timestamp: point.timestamp,
      interpretation: point.interpretation,
      color: interpretation.color,
      index: index + 1 // Номер теста
    };
  });
};

/**
 * Получает статистику по настроению
 */
export interface MoodStats {
  totalTests: number;
  averageScore: number | null;
  latestScore: number | null;
  improvement: number | null;
  trend: 'improving' | 'worsening' | 'stable' | null;
  bestScore: number | null;
  worstScore: number | null;
}

export const getMoodStats = (state: RootState): MoodStats => {
  const moodData = getMoodTrendData(state);
  const scores = moodData.map(d => d.score);

  return {
    totalTests: moodData.length,
    averageScore: getAverageMoodScore(state),
    latestScore: getLatestBurnsScore(state)?.score || null,
    improvement: getMoodImprovement(state),
    trend: getMoodTrend(state),
    bestScore: scores.length > 0 ? Math.min(...scores) : null,
    worstScore: scores.length > 0 ? Math.max(...scores) : null
  };
};
