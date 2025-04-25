import { BaseExercise } from "../../../types/progress.types";

export interface MotivationWithoutCoercionRecord {
  id: string;
  thought: string;
  advantages: string[];
  disadvantages: string[];
  timestamp: string;
}

export interface MotivationWithoutCoercionExercise extends BaseExercise {
  records: MotivationWithoutCoercionRecord[];
}
