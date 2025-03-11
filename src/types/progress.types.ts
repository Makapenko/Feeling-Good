export interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string; // ISO date string
}

export interface Exercise {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number; // in seconds
  targetTime?: number; // optional target time in seconds
  startedAt?: string;
  completedAt?: string;
}

export interface ChapterProgress {
  id: string; // chapter id (e.g. 'ch01')
  timeSpent: number; // in seconds
  completed: boolean;
  lastPosition?: number; // optional scroll position
  completedAt?: string;
}

export interface DailyProgress {
  date: string; // ISO date string
  chapters: {
    [chapterId: string]: ChapterProgress;
  };
  exercises: Exercise[];
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
  | 'check-cant-do';

export interface UserProgress {
  currentChapter: Chapter | null;
  specialContent: SpecialContent | null;
  dailyProgress: {
    [date: string]: DailyProgress;
  };
}

// Удалить пример использования и оставить только типы 
