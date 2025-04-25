import { BaseExercise } from "../../../types/progress.types";

export interface Task {
  id: string;
  text: string;
  expectedDifficulty: number;
  expectedPleasure: number;
  actualDifficulty: number | null;
  actualPleasure: number | null;
  completed: boolean;
  timestamp?: string;
}

export interface TaskStep {
  id: string;
  text: string;
  isCompleted: boolean;
} 

export interface AntiProcrastinationExercise extends BaseExercise {
  records: Task[];
}
