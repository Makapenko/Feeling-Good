/**
 * Точка данных для графика прогресса
 */
export interface ChartDataPoint {
  /** Дата в формате ISO (YYYY-MM-DD) */
  date: string;
  /** Отформатированная дата для отображения */
  formattedDate: string;
  /** Значение по шкале депрессии Бернса */
  depressionScore?: number | null;
  /** Процент от максимального значения шкалы депрессии */
  depressionPercentage?: number | null;
  /** Флаг, указывающий был ли пройден тест в этот день */
  hasDepressionTest?: boolean;
  /** Время чтения в минутах */
  readingTime: number;
  /** Время упражнений в минутах */
  exerciseTime?: number;
  /** Общее время активности в минутах (чтение + упражнения) */
  totalActivityTime?: number;
}

/**
 * Данные для демонстрационного графика
 */
export interface MockChartData {
  /** Заголовок графика */
  chartTitle: string;
  /** Описание графика */
  chartDescription: string;
  /** Точки данных для графика */
  data: ChartDataPoint[];
} 
