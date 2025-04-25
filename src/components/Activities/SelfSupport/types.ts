import { BaseExercise } from "../../../types/progress.types";

export interface SupportStatement {
  id: string;
  devaluing: string;
  supporting: string;
  timestamp: string;
} 

export interface SelfSupportExercise extends BaseExercise {
  records: SupportStatement[];
}
