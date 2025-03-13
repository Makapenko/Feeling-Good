import { ThoughtRecord } from '../components/Activities/ThreeColumnsBase/types';

export interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string; // ISO date string
}

export interface ThoughtDiaryRecord {
  situation: string;
  emotions: Array<{ name: string; intensity: number }>;
  automaticThoughts: Array<{
    thought: string;
    cognitiveDistortions: string[];
    rationalResponse: string;
  }>;
  result: {
    emotions: Array<{ name: string; intensity: number }>;
  };
  timestamp: string;
}

export interface ThoughtDiaryExercise {
  type: 'thought-diary';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: ThoughtDiaryRecord[];
}

export interface ThreeColumnsExercise {
  type: 'three-columns-method';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: ThoughtRecord[];
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

export interface DailyScheduleExercise {
  type: 'daily-schedule';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  date: string;
  timeSlots: DailyScheduleRecord[];
}

export interface AntiProcrastinationTask {
  id: string;
  text: string;
  expectedDifficulty: number;
  expectedPleasure: number;
  actualDifficulty: number | null;
  actualPleasure: number | null;
  completed: boolean;
  timestamp: string;
}

export interface AntiProcrastinationExercise {
  type: 'anti-procrastination';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: AntiProcrastinationTask[];
}

export interface PleasureSheetActivity {
  id: string;
  text: string;
  participants: string;
  expectedPleasure: number;
  actualPleasure: number | null;
  timestamp: string;
  date: string;
}

export interface PleasureSheetExercise {
  type: 'pleasure-sheet';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: PleasureSheetActivity[];
}

export interface NoButsPair {
  id: string;
  but: string;
  noBut: string;
  timestamp: string;
}

export interface NoButsExercise {
  type: 'no-buts';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: NoButsPair[];
}

export type Exercise = ThreeColumnsExercise | ThoughtDiaryExercise | DailyScheduleExercise | AntiProcrastinationExercise | PleasureSheetExercise | NoButsExercise;

export interface ChapterProgress {
  id: string; // chapter id (e.g. 'ch01')
  timeSpent: number; // in seconds
  completed: boolean;
  lastPosition?: number; // optional scroll position
  completedAt?: string;
}

export interface DayProgress {
  chapters: {
    [chapterId: string]: ChapterProgress;
  };
  exercises: {
    testResults: TestResult[];
    exercises: Exercise[];
  };
}

export interface DailyProgress {
  [date: string]: DayProgress;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  timeSpent: number;
  completed: boolean;
}

export type SpecialContent = 
  | 'burns-checklist'
  | 'novaco-scale'
  | 'cognitive-biases'
  | 'cognitive-biases-test'
  | 'three-columns-method'
  | 'thought-diary'
  | 'daily-schedule'
  | 'anti-procrastination'
  | 'pleasure-sheet'
  | 'no-buts'
  | 'self-support'
  | 'self-activation'
  | 'hindering-helping-thoughts'
  | 'disarming-technique'
  | 'motivation-without-coercion'
  | 'no-lose-technique'
  | 'small-steps'
  | 'imagine-success'
  | 'count-achievements'
  | 'check-cant-do'
  | 'progress-calendar'
  | null;

export interface UserProgress {
  currentChapter: Chapter | null;
  specialContent: SpecialContent;
  dailyProgress: DailyProgress;
  chapters: Chapter[];
}
