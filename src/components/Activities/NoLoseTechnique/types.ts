import { BaseExercise } from "../../../types/progress.types";

export interface NoLoseTechniqueRecord {
  id: string;
  leftColumn: string;
  cognitiveDistortion: string[];
  rightColumn: string;
  timestamp: string;
}

export interface NoLoseTechniqueExercise extends BaseExercise {
  records: NoLoseTechniqueRecord[];
}
