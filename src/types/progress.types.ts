import { ThoughtRecord } from '../components/Activities/ThreeColumnsBase/types';

export interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string; // ISO date string
}

export interface ThreeColumnsExercise {
  type: 'three-columns-method';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: ThoughtRecord[];
}

export type Exercise = ThreeColumnsExercise;

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
