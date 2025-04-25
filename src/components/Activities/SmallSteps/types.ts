import { BaseExercise } from '../../../types/progress.types';

export interface SmallStep {
  id: string;
  text: string;
  isCompleted: boolean;
  duration: number; // в минутах
  isRest: boolean;
  timeLeft: number; // в секундах
  timerEnded: boolean; // флаг для отслеживания завершения таймера
}

export interface SmallStepsTask {
  id: string;
  title: string;
  steps: SmallStep[];
  isActive: boolean;
  isCompleted?: boolean; // флаг завершения всей задачи
  currentStepId?: string;
} 

export interface SmallStepsExercise extends BaseExercise {
  records: SmallStepsTask[];
}
