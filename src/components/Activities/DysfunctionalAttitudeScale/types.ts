import { BaseExercise } from '../../../types/progress.types';

// Ответы на опросник
export interface DASAnswer {
  label: string;
  value: number;
}

// Утверждение в опроснике
export interface DASStatement {
  id: number;
  text: string;
  category: DASCategory;
}

// Категории убеждений
export enum DASCategory {
  APPROVAL = 'approval',
  LOVE = 'love',
  ACHIEVEMENT = 'achievement',
  PERFECTIONISM = 'perfectionism',
  ENTITLEMENT = 'entitlement',
  OMNIPOTENCE = 'omnipotence',
  AUTONOMY = 'autonomy'
}

// Описание категорий для отображения
export interface DASCategoryDescription {
  category: DASCategory;
  title: string;
  description?: string; // Делаем необязательным, так как удалено из config
  positiveDescription: string; // Описание для положительного значения (>= 0)
  negativeDescription: string; // Описание для отрицательного значения (< 0)
}

// Результаты для каждой категории
export interface DASCategoryResult {
  category: DASCategory;
  score: number;
  isStrength: boolean;
}

// Общий результат теста
export interface DASResult extends BaseExercise {
  answers: Record<number, number>;
  categoryResults: DASCategoryResult[];
  timestamp: string;
}

// Состояние компонента
export interface DASState {
  answers: Record<number, number>;
  step: 'instructions' | 'survey' | 'results';
  categoryResults: DASCategoryResult[];
} 

export interface DysfunctionalAttitudeScaleExercise extends BaseExercise {
  answers: Record<number, number>;
  categoryResults: {
    category: string;
    score: number;
    isStrength: boolean;
  }[];
  timestamp: string;
}
