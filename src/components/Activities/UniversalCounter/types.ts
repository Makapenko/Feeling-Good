import { BaseExercise } from '../../../types/progress.types';

export interface CounterClick {
  id: string;
  timestamp: string;
  note?: string;
}

export interface UniversalCounterExercise extends BaseExercise {
  clicks: CounterClick[];
}
