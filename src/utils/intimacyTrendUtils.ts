import { RootState } from '../redux/types';
import { ACTIVITY_IDS } from '../constants/activities';
import { IntimacyCategory } from '../components/Activities/IntimacyScale/types';

/**
 * Точка данных для одного теста на способность к близости
 */
export interface IntimacyDataPoint {
  date: string;
  timestamp: string;
  categoryResults: {
    category: string;
    score: number;
    maxScore: number;
  }[];
  totalScore: number; // 0–180
}

/**
 * Цвета для каждой категории (15 различных цветов)
 */
export const INTIMACY_CATEGORY_COLORS: Record<string, string> = {
  [IntimacyCategory.LOW_SELF_ESTEEM]: '#667eea',
  [IntimacyCategory.ROMANTIC_PERFECTIONISM]: '#f093fb',
  [IntimacyCategory.EMOTIONAL_PERFECTIONISM]: '#4facfe',
  [IntimacyCategory.SHYNESS]: '#43e97b',
  [IntimacyCategory.HOPELESSNESS]: '#fa709a',
  [IntimacyCategory.ALIENATION]: '#feca57',
  [IntimacyCategory.REJECTION_SENSITIVITY]: '#ff6348',
  [IntimacyCategory.FEAR_OF_LONELINESS]: '#a29bfe',
  [IntimacyCategory.DESPAIR]: '#fd79a8',
  [IntimacyCategory.FEAR_OF_EXPOSURE]: '#00cec9',
  [IntimacyCategory.INDECISIVENESS]: '#e17055',
  [IntimacyCategory.RESENTMENT]: '#6c5ce7',
  [IntimacyCategory.DEFENSE_CRITICISM_FEAR]: '#55efc4',
  [IntimacyCategory.DEPRESSION]: '#636e72',
  [IntimacyCategory.FEAR_OF_TRAP]: '#fdcb6e',
};

/**
 * Названия категорий на русском
 */
export const INTIMACY_CATEGORY_LABELS: Record<string, string> = {
  [IntimacyCategory.LOW_SELF_ESTEEM]: 'Самооценка',
  [IntimacyCategory.ROMANTIC_PERFECTIONISM]: 'Ром. перфекц.',
  [IntimacyCategory.EMOTIONAL_PERFECTIONISM]: 'Эм. перфекц.',
  [IntimacyCategory.SHYNESS]: 'Застенчивость',
  [IntimacyCategory.HOPELESSNESS]: 'Безнадежность',
  [IntimacyCategory.ALIENATION]: 'Отчужденность',
  [IntimacyCategory.REJECTION_SENSITIVITY]: 'Чувств. к отверж.',
  [IntimacyCategory.FEAR_OF_LONELINESS]: 'Страх одиноч.',
  [IntimacyCategory.DESPAIR]: 'Отчаяние',
  [IntimacyCategory.FEAR_OF_EXPOSURE]: 'Страх разоблач.',
  [IntimacyCategory.INDECISIVENESS]: 'Нерешительность',
  [IntimacyCategory.RESENTMENT]: 'Обида',
  [IntimacyCategory.DEFENSE_CRITICISM_FEAR]: 'Страх критики',
  [IntimacyCategory.DEPRESSION]: 'Депрессия',
  [IntimacyCategory.FEAR_OF_TRAP]: 'Страх ловушки',
};

/**
 * Извлекает все данные тестов на близость из Redux
 */
export const getIntimacyData = (state: RootState): IntimacyDataPoint[] => {
  const { dailyProgress } = state.progress;
  const data: IntimacyDataPoint[] = [];

  Object.entries(dailyProgress).forEach(([date, dayData]) => {
    if (!dayData.exercises?.exercises) return;

    dayData.exercises.exercises.forEach((exercise: any) => {
      if (
        exercise.type !== ACTIVITY_IDS.INTIMACY_SCALE ||
        !exercise.categoryResults ||
        !Array.isArray(exercise.categoryResults)
      ) {
        return;
      }

      const totalScore = exercise.totalScore ?? exercise.categoryResults.reduce(
        (sum: number, cat: any) => sum + (cat.score || 0),
        0
      );

      data.push({
        date,
        timestamp: exercise.timestamp || exercise.completedAt,
        categoryResults: exercise.categoryResults,
        totalScore
      });
    });
  });

  return data.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

/**
 * Форматирует данные для мультилайн-графика Recharts
 */
export interface IntimacyChartDataPoint {
  name: string;
  date: string;
  timestamp: string;
  [key: string]: string | number;
}

export const MAX_CATEGORY_SCORE = 12; // 4 вопроса * 3 балла

export const formatIntimacyDataForChart = (data: IntimacyDataPoint[]): IntimacyChartDataPoint[] => {
  return data.map((point) => {
    const formattedPoint: IntimacyChartDataPoint = {
      name: new Date(point.date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short'
      }),
      date: point.date,
      timestamp: point.timestamp
    };

    // Инвертируем: 12 - score, чтобы выше = лучше (как в DAS)
    point.categoryResults.forEach((catResult: any) => {
      formattedPoint[catResult.category] = MAX_CATEGORY_SCORE - catResult.score;
      // Сохраняем реальный балл для тултипа
      formattedPoint[`${catResult.category}_raw`] = catResult.score;
    });

    return formattedPoint;
  });
};

/**
 * Статистика по тестам на близость
 */
export interface IntimacyStats {
  totalTests: number;
  averageScore: number | null;
  latestScore: number | null;
  improvement: number | null;
  trend: 'improving' | 'worsening' | 'stable' | null;
  bestScore: number | null;
  worstScore: number | null;
}

export const getIntimacyStats = (state: RootState): IntimacyStats => {
  const data = getIntimacyData(state);

  if (data.length === 0) {
    return {
      totalTests: 0,
      averageScore: null,
      latestScore: null,
      improvement: null,
      trend: null,
      bestScore: null,
      worstScore: null
    };
  }

  const MAX_TOTAL = 180; // 15 категорий * 12 баллов
  // Инвертируем: выше = лучше (способность к близости)
  const invertedScores = data.map(d => MAX_TOTAL - d.totalScore);
  const sum = invertedScores.reduce((acc, s) => acc + s, 0);
  const averageScore = Math.round((sum / invertedScores.length) * 10) / 10;
  const latestScore = invertedScores[invertedScores.length - 1];

  let improvement: number | null = null;
  if (data.length >= 2) {
    // Положительное = рост инвертированного балла = улучшение
    improvement = invertedScores[invertedScores.length - 1] - invertedScores[0];
  }

  let trend: 'improving' | 'worsening' | 'stable' | null = null;
  if (data.length >= 3) {
    const recent = invertedScores.slice(-3);
    const diff = recent[recent.length - 1] - recent[0];
    if (Math.abs(diff) < 10) {
      trend = 'stable';
    } else {
      trend = diff > 0 ? 'improving' : 'worsening';
    }
  }

  return {
    totalTests: data.length,
    averageScore,
    latestScore,
    improvement,
    trend,
    bestScore: Math.max(...invertedScores), // Лучший = максимальный инвертированный
    worstScore: Math.min(...invertedScores)
  };
};

/**
 * Интерпретация общего балла теста на близость
 */
export const getIntimacyInterpretation = (invertedScore: number): { label: string; color: string } => {
  // Инвертированный балл 0–180, чем выше — тем лучше
  if (invertedScore >= 150) {
    return { label: 'Отличная способность к близости', color: '#28a745' };
  } else if (invertedScore >= 120) {
    return { label: 'Хорошая способность к близости', color: '#90EE90' };
  } else if (invertedScore >= 90) {
    return { label: 'Умеренные трудности', color: '#ffc107' };
  } else if (invertedScore >= 50) {
    return { label: 'Заметные трудности', color: '#fd7e14' };
  } else {
    return { label: 'Серьёзные трудности с близостью', color: '#dc3545' };
  }
};
