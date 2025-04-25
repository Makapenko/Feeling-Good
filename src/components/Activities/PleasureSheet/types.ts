import { BaseExercise } from "../../../types/progress.types";

export interface Activity {
  id: string;
  text: string;
  participants: string;
  expectedPleasure: number;
  actualPleasure: number | null;
  timestamp: string;
  date: string;
  completed: boolean;
} 

export interface PleasureSheetExercise extends BaseExercise {
  records: Activity[];
}
