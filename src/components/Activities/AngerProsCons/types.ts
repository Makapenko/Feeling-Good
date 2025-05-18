// Типы для упражнения "Преимущества и недостатки гнева"
import { BaseExercise } from '../../../types/progress.types';
import { ThoughtRecord } from '../ThreeColumnsBase/types';

// Одна запись упражнения
export interface AngerProsConsExercise extends BaseExercise {
  records: ThoughtRecord[]; // плюсы/минусы
  positiveConsequences: string[]; // последствия
  date?: string; // дата записи (для сортировки и отображения)
} 
