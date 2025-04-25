import { BaseExercise } from "../../../types/progress.types";

export interface Activity {
  text: string;
  type: {
    isTask: boolean;
    isPleasure: boolean;
  };
  ratings: {
    task: number | null;
    pleasure: number | null;
  };
}

export interface TimeSlot {
  time: string;
  planned: Activity | null;
  actual: Activity | null;
} 

export interface DailyScheduleRecord {
  time: string;
  planned: {
    text: string;
    type: { isTask: boolean; isPleasure: boolean };
    ratings: { task: number | null; pleasure: number | null };
  } | null;
  actual: {
    text: string;
    type: { isTask: boolean; isPleasure: boolean };
    ratings: { task: number | null; pleasure: number | null };
  } | null;
}

export interface DailyScheduleExercise extends BaseExercise {
  date: string;
  timeSlots: DailyScheduleRecord[];
}
