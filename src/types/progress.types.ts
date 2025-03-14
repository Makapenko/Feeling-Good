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

export interface SupportStatement {
  id: string;
  devaluing: string;
  supporting: string;
  timestamp: string;
}

export interface SelfSupportExercise {
  type: 'self-support';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: SupportStatement[];
}

export interface SmallStep {
  id: string;
  text: string;
  isCompleted: boolean;
  duration: number;
  isRest: boolean;
  timeLeft: number;
  timerEnded: boolean;
}

export interface SmallStepsTask {
  id: string;
  title: string;
  steps: SmallStep[];
  isActive: boolean;
  isCompleted?: boolean;
  currentStepId?: string;
}

export interface SmallStepsExercise {
  type: 'small-steps';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: SmallStepsTask[];
}

export interface MotivationWithoutCoercionRecord {
  id: string;
  thought: string;
  advantages: string[];
  disadvantages: string[];
  timestamp: string;
}

export interface MotivationWithoutCoercionExercise {
  type: 'motivation-without-coercion';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: MotivationWithoutCoercionRecord[];
}

export interface ImagineSuccessRecord {
  id: string;
  goal: string;
  advantages: Array<{
    id: string;
    text: string;
  }>;
  timestamp: string;
}

export interface ImagineSuccessExercise {
  type: 'imagine-success';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: ImagineSuccessRecord[];
}

export interface CountAchievementsRecord {
  id: string;
  text: string;
  timestamp: string;
}

export interface CountAchievementsExercise {
  type: 'count-achievements';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: CountAchievementsRecord[];
}

export interface CheckCantDoRecord {
  id: string;
  text: string;
  minimumDone: boolean;
  minimumDescription: string;
  timestamp: string;
}

export interface CheckCantDoExercise {
  type: 'check-cant-do';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: CheckCantDoRecord[];
}

export interface NoLoseTechniqueRecord {
  id: string;
  leftColumn: string;
  cognitiveDistortion: string[];
  rightColumn: string;
  timestamp: string;
}

export interface NoLoseTechniqueExercise {
  type: 'no-lose-technique';
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: NoLoseTechniqueRecord[];
}

export type Exercise = ThreeColumnsExercise | ThoughtDiaryExercise | DailyScheduleExercise | 
  AntiProcrastinationExercise | PleasureSheetExercise | NoButsExercise | SelfSupportExercise | 
  SmallStepsExercise | MotivationWithoutCoercionExercise | ImagineSuccessExercise | CountAchievementsExercise |
  CheckCantDoExercise | NoLoseTechniqueExercise;

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
  | 'welcome'
  | null;

export interface UnlockedContent {
  chapters: string[];  // массив id открытых глав
  activities: string[]; // массив id открытых заданий
}

export interface UserProgress {
  currentChapter: Chapter | null;
  specialContent: SpecialContent | null;
  chapters: Chapter[];
  dailyProgress: Record<string, DayProgress>;
  unlockedContent: {
    chapters: string[];
    activities: string[];
  };
  completedChapters: string[]; // Массив ID завершенных глав и подглав
}
