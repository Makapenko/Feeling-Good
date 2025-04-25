import { BaseExercise } from "../../../types/progress.types";

export interface RewriteBeliefExercise extends BaseExercise {
  belief: string;
  newBelief?: string;
  advantages: string[];
  disadvantages: string[];
  timestamp: string;
}
