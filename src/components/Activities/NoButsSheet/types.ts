import { BaseExercise } from "../../../types/progress.types";

export interface ButPair {
  id: string;
  but: string;
  noBut: string;
  timestamp: string;
}

export interface NoButsExercise extends BaseExercise {
  records: ButPair[];
}
