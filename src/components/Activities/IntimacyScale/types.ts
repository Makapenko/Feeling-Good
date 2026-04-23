import { BaseExercise } from '../../../types/progress.types';

export interface IntimacyAnswer {
  label: string;
  value: number;
}

export interface IntimacyStatement {
  id: number;
  text: string;
  category: IntimacyCategory;
}

export enum IntimacyCategory {
  LOW_SELF_ESTEEM = 'low-self-esteem',
  ROMANTIC_PERFECTIONISM = 'romantic-perfectionism',
  EMOTIONAL_PERFECTIONISM = 'emotional-perfectionism',
  SHYNESS = 'shyness',
  HOPELESSNESS = 'hopelessness',
  ALIENATION = 'alienation',
  REJECTION_SENSITIVITY = 'rejection-sensitivity',
  FEAR_OF_LONELINESS = 'fear-of-loneliness',
  DESPAIR = 'despair',
  FEAR_OF_EXPOSURE = 'fear-of-exposure',
  INDECISIVENESS = 'indecisiveness',
  RESENTMENT = 'resentment',
  DEFENSE_CRITICISM_FEAR = 'defense-criticism-fear',
  DEPRESSION = 'depression',
  FEAR_OF_TRAP = 'fear-of-trap',
}

export interface IntimacyCategoryDescription {
  category: IntimacyCategory;
  title: string;
}

export interface IntimacyCategoryResult {
  category: IntimacyCategory;
  score: number;
  maxScore: number;
}

export interface IntimacyState {
  answers: Record<number, number>;
  step: 'instructions' | 'survey' | 'results';
  categoryResults: IntimacyCategoryResult[];
}

export interface IntimacyScaleExercise extends BaseExercise {
  answers: Record<number, number>;
  categoryResults: IntimacyCategoryResult[];
  totalScore: number;
  timestamp: string;
}
