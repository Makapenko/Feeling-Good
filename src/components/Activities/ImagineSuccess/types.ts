import { BaseExercise } from "../../../types/progress.types";

export interface ImagineSuccessRecord {
  id: string;
  goal: string;
  advantages: Array<{
    id: string;
    text: string;
  }>;
  timestamp: string;
}

export interface ImagineSuccessExercise extends BaseExercise {
  records: ImagineSuccessRecord[];
}
