import { BaseExercise } from "../../../types/progress.types";

export interface CheckCantDoRecord {
  id: string;
  text: string;
  minimumDone: boolean;
  minimumDescription: string;
  timestamp: string;
}

export interface CheckCantDoExercise extends BaseExercise {
  records: CheckCantDoRecord[];
}
