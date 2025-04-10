import { ThoughtRecord } from '../components/Activities/ThreeColumnsBase/types';
import { ActivityId } from '../constants/activities';

/**
 * Базовый интерфейс для всех упражнений.
 * Содержит общие поля, присутствующие во всех типах упражнений.
 */
export interface BaseExercise {
  type: ActivityId;  // ID типа активности (упражнения)
  id: string;        // Уникальный идентификатор конкретного экземпляра упражнения
  name: string;      // Имя упражнения, вычисляемое из type через ACTIVITY_NAMES
  completed: boolean;
  completedAt: string;
}

export interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string; // ISO date string
  content?: SpecialContent; // ID типа активности, связанной с тестом
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
  timeSpent?: number;
}

export interface ThoughtDiaryExercise extends BaseExercise {
  records: ThoughtDiaryRecord[];
}

export interface ThreeColumnsExercise extends BaseExercise {
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

export interface DailyScheduleExercise extends BaseExercise {
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

export interface AntiProcrastinationExercise extends BaseExercise {
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

export interface PleasureSheetExercise extends BaseExercise {
  records: PleasureSheetActivity[];
}

export interface NoButsPair {
  id: string;
  but: string;
  noBut: string;
  timestamp: string;
}

export interface NoButsExercise extends BaseExercise {
  records: NoButsPair[];
}

export interface SupportStatement {
  id: string;
  devaluing: string;
  supporting: string;
  timestamp: string;
}

export interface SelfSupportExercise extends BaseExercise {
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

export interface SmallStepsExercise extends BaseExercise {
  records: SmallStepsTask[];
}

export interface MotivationWithoutCoercionRecord {
  id: string;
  thought: string;
  advantages: string[];
  disadvantages: string[];
  timestamp: string;
}

export interface MotivationWithoutCoercionExercise extends BaseExercise {
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

export interface ImagineSuccessExercise extends BaseExercise {
  records: ImagineSuccessRecord[];
}

export interface CountAchievementsRecord {
  id: string;
  text: string;
  timestamp: string;
}

export interface CountAchievementsExercise extends BaseExercise {
  records: CountAchievementsRecord[];
}

export interface CheckCantDoRecord {
  id: string;
  text: string;
  minimumDone: boolean;
  minimumDescription: string;
  timestamp: string;
}

export interface CheckCantDoExercise extends BaseExercise {
  records: CheckCantDoRecord[];
}

export interface NoLoseTechniqueRecord {
  id: string;
  leftColumn: string;
  cognitiveDistortion: string[];
  rightColumn: string;
  timestamp: string;
}

export interface NoLoseTechniqueExercise extends BaseExercise {
  records: NoLoseTechniqueRecord[];
}

export interface DownwardArrowExercise extends BaseExercise {
  chains: import('../components/Activities/DownwardArrow/DownwardArrowTypes').DownwardArrowChain[];
}

export interface DysfunctionalAttitudeScaleExercise extends BaseExercise {
  answers: Record<number, number>;
  categoryResults: {
    category: string;
    score: number;
    isStrength: boolean;
  }[];
  timestamp: string;
}

export type Exercise = ThreeColumnsExercise | ThoughtDiaryExercise | DailyScheduleExercise | 
  AntiProcrastinationExercise | PleasureSheetExercise | NoButsExercise | SelfSupportExercise | 
  SmallStepsExercise | MotivationWithoutCoercionExercise | ImagineSuccessExercise | CountAchievementsExercise |
  CheckCantDoExercise | NoLoseTechniqueExercise | DownwardArrowExercise | DysfunctionalAttitudeScaleExercise | RewriteBeliefExercise;

export interface ChapterProgress {
  id: string; // chapter id (e.g. 'ch01')
  timeSpent: number; // in seconds
  completed: boolean;
  lastPosition?: number; // optional scroll position
  completedAt?: string;
}

export interface ActivityProgress {
  id: string; // activity id
  timeSpent: number; // in seconds
  completedAt?: string;
}

export interface DayProgress {
  chapters: {
    [chapterId: string]: ChapterProgress;
  };
  activities?: {
    [activityId: string]: ActivityProgress;
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
  timeSpent: number;
  completed: boolean;
}

export interface ChapterWithContent extends Chapter {
  content: string;
}

export type SpecialContent = ActivityId;

export interface UnlockedContent {
  chapters: string[];  // массив id открытых глав
  activities: string[]; // массив id открытых заданий
}

// Тип для избранных глав
export interface FavoriteChapter {
  id: string;
  title: string;
}

// Обновляем интерфейс UserProgress, добавляя поле для избранных глав
export interface UserProgress {
  currentChapter: ChapterWithContent | null;
  specialContent: SpecialContent | null;
  dailyProgress: Record<string, DayProgress>;
  chapters: Chapter[];
  unlockedContent: {
    chapters: string[];
    activities: string[];
  };
  completedChapters: string[];
  favoriteActivities: string[];
  lastUnlockedChapter: string | null;
  lastUnlockedActivities: SpecialContent[];
  favoriteChapters: FavoriteChapter[]; // Добавляем поле для избранных глав
  reduxMigrationCompleted?: boolean; // Флаг, указывающий, что миграция в Redux успешно выполнена
  readingHistory: Record<string, DailyProgress>;
}
