import { RootState } from '../redux/types';
import { ACTIVITY_IDS } from '../constants/activities';
import { DASCategory } from '../components/Activities/DysfunctionalAttitudeScale/types';

/**
 * Точка данных для одного теста DAS
 */
export interface DASDataPoint {
  date: string; // ISO date string
  timestamp: string; // ISO timestamp
  categoryResults: {
    category: string;
    score: number;
    isStrength: boolean;
  }[];
  totalScore: number; // Сумма всех категорий (от -70 до +70)
}

/**
 * Данные для графика по конкретной категории
 */
export interface DASCategoryTrendPoint {
  date: string;
  timestamp: string;
  score: number;
  category: string;
}

/**
 * Цвета для каждой категории (7 различных цветов)
 */
export const CATEGORY_COLORS: Record<string, string> = {
  [DASCategory.APPROVAL]: '#667eea', // Фиолетовый
  [DASCategory.LOVE]: '#f093fb', // Розовый
  [DASCategory.ACHIEVEMENT]: '#4facfe', // Голубой
  [DASCategory.PERFECTIONISM]: '#43e97b', // Зеленый
  [DASCategory.ENTITLEMENT]: '#fa709a', // Коралловый
  [DASCategory.OMNIPOTENCE]: '#feca57', // Желтый
  [DASCategory.AUTONOMY]: '#ff6348' // Оранжево-красный
};

/**
 * Названия категорий на русском
 */
export const CATEGORY_LABELS: Record<string, string> = {
  [DASCategory.APPROVAL]: 'Одобрение',
  [DASCategory.LOVE]: 'Любовь',
  [DASCategory.ACHIEVEMENT]: 'Достижения',
  [DASCategory.PERFECTIONISM]: 'Перфекционизм',
  [DASCategory.ENTITLEMENT]: 'Право',
  [DASCategory.OMNIPOTENCE]: 'Всемогущество',
  [DASCategory.AUTONOMY]: 'Автономия'
};

/**
 * Извлекает все данные DAS тестов из Redux
 */
export const getDASData = (state: RootState): DASDataPoint[] => {
  const { dailyProgress } = state.progress;
  const dasData: DASDataPoint[] = [];

  // Проходим по всем дням
  Object.entries(dailyProgress).forEach(([date, dayData]) => {
    if (!dayData.exercises?.exercises) return;

    // Находим DAS тесты за этот день
    dayData.exercises.exercises.forEach((exercise: any) => {
      if (
        exercise.type !== ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE ||
        !exercise.categoryResults ||
        !Array.isArray(exercise.categoryResults)
      ) {
        return;
      }

      // Вычисляем общий балл (сумма всех категорий)
      const totalScore = exercise.categoryResults.reduce(
        (sum: number, cat: any) => sum + (cat.score || 0),
        0
      );

      dasData.push({
        date: date,
        timestamp: exercise.timestamp || exercise.completedAt,
        categoryResults: exercise.categoryResults,
        totalScore
      });
    });
  });

  // Сортируем по timestamp
  return dasData.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

/**
 * Получает последний результат DAS теста
 */
export const getLatestDASResult = (state: RootState): DASDataPoint | null => {
  const dasData = getDASData(state);
  return dasData.length > 0 ? dasData[dasData.length - 1] : null;
};

/**
 * Получает данные для конкретной категории
 */
export const getDASCategoryTrend = (
  state: RootState,
  category: DASCategory
): DASCategoryTrendPoint[] => {
  const dasData = getDASData(state);

  return dasData.map(point => {
    const categoryResult = point.categoryResults.find(
      (cat: any) => cat.category === category
    );

    return {
      date: point.date,
      timestamp: point.timestamp,
      score: categoryResult?.score || 0,
      category
    };
  });
};

/**
 * Форматирует данные для мультилайн-графика Recharts
 */
export interface DASChartDataPoint {
  name: string; // Дата для оси X
  date: string; // ISO date
  timestamp: string; // ISO timestamp
  [key: string]: string | number; // Динамические ключи для категорий
}

export const formatDASDataForChart = (dasData: DASDataPoint[]): DASChartDataPoint[] => {
  return dasData.map((point) => {
    const formattedPoint: DASChartDataPoint = {
      name: new Date(point.date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short'
      }),
      date: point.date,
      timestamp: point.timestamp
    };

    // Добавляем баллы для каждой категории
    point.categoryResults.forEach((catResult: any) => {
      formattedPoint[catResult.category] = catResult.score;
    });

    return formattedPoint;
  });
};

/**
 * Вычисляет изменение общего балла (первый vs последний тест)
 */
export const getDASImprovement = (state: RootState): number | null => {
  const dasData = getDASData(state);
  if (dasData.length < 2) return null;

  const firstScore = dasData[0].totalScore;
  const lastScore = dasData[dasData.length - 1].totalScore;

  return lastScore - firstScore; // Положительное = улучшение
};

/**
 * Вычисляет средний балл за все время
 */
export const getAverageDASScore = (state: RootState): number | null => {
  const dasData = getDASData(state);
  if (dasData.length === 0) return null;

  const sum = dasData.reduce((acc, point) => acc + point.totalScore, 0);
  return Math.round((sum / dasData.length) * 10) / 10; // Округляем до 1 знака
};

/**
 * Получает тренд общего балла (improving/worsening/stable)
 */
export const getDASTrend = (
  state: RootState
): 'improving' | 'worsening' | 'stable' | null => {
  const dasData = getDASData(state);
  if (dasData.length < 3) return null;

  // Берем последние 3 результата
  const recentData = dasData.slice(-3);

  const firstScore = recentData[0].totalScore;
  const lastScore = recentData[recentData.length - 1].totalScore;

  const difference = lastScore - firstScore;

  // Порог для определения стабильности (10 баллов из 140 возможных)
  if (Math.abs(difference) < 10) return 'stable';

  return difference > 0 ? 'improving' : 'worsening';
};

/**
 * Получает лучший и худший результаты
 */
export const getDASBestWorst = (
  state: RootState
): { best: number | null; worst: number | null } => {
  const dasData = getDASData(state);
  if (dasData.length === 0) return { best: null, worst: null };

  const scores = dasData.map(d => d.totalScore);

  return {
    best: Math.max(...scores),
    worst: Math.min(...scores)
  };
};

/**
 * Статистика по DAS тестам
 */
export interface DASStats {
  totalTests: number;
  averageScore: number | null;
  latestScore: number | null;
  improvement: number | null;
  trend: 'improving' | 'worsening' | 'stable' | null;
  bestScore: number | null;
  worstScore: number | null;
}

export const getDASStats = (state: RootState): DASStats => {
  const dasData = getDASData(state);
  const { best, worst } = getDASBestWorst(state);

  return {
    totalTests: dasData.length,
    averageScore: getAverageDASScore(state),
    latestScore: getLatestDASResult(state)?.totalScore || null,
    improvement: getDASImprovement(state),
    trend: getDASTrend(state),
    bestScore: best,
    worstScore: worst
  };
};

/**
 * Получает интерпретацию общего балла DAS
 */
export const getDASInterpretation = (totalScore: number): { label: string; color: string } => {
  // Общий балл от -70 до +70
  if (totalScore >= 35) {
    return { label: 'Отличные здоровые убеждения', color: '#28a745' };
  } else if (totalScore >= 15) {
    return { label: 'Хорошие убеждения', color: '#90EE90' };
  } else if (totalScore >= -15) {
    return { label: 'Умеренные убеждения', color: '#ffc107' };
  } else if (totalScore >= -35) {
    return { label: 'Проблемные убеждения', color: '#fd7e14' };
  } else {
    return { label: 'Дисфункциональные убеждения', color: '#dc3545' };
  }
};
