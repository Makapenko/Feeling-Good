import { BaseExercise } from "../../../types/progress.types";

export interface CountAchievementsRecord {
  id: string;
  text: string;
  timestamp: string;
}

export interface CountAchievementsExercise extends BaseExercise {
  records: CountAchievementsRecord[];
}
