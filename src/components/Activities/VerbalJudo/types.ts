import { BaseExercise } from '../../../types/progress.types';

export interface VerbalJudoEntry {
  id: string;
  criticism: string;
  negativeThoughts: string;
  rationalResponse: string;
  createdAt: number;
}

export interface VerbalJudoExercise extends BaseExercise {
  entries: VerbalJudoEntry[];
} 
