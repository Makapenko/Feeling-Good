import { Exercise, SpecialContent } from '../types/progress.types';
import { Notification } from './slices/notificationSlice';
import { MobileTab } from './slices/mobileSlice';
import { store } from './store';

// Тип для избранных глав
export interface FavoriteChapter {
  id: string;
  title: string;
}

// Рейтинг упражнения
export interface ExerciseRating {
  exerciseId: string; // ID выполненного упражнения
  activityId: string; // ID типа активности (например, 'thought-diary')
  rating: number; // 1-5 звезд
  ratedAt: string; // ISO timestamp
  comment?: string; // Опциональный комментарий
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
  exerciseRatings: ExerciseRating[]; // Рейтинги упражнений
}


// Определяем тип для корневого состояния Redux
export interface RootState {
  progress: UserProgress;
  mobile: {
    activeTab: MobileTab;
  };
  notification: {
    notifications: Notification[];
  };
}

// Тип диспетчера
export type AppDispatch = typeof store.dispatch; 

export interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string; // ISO date string
  content?: SpecialContent; // ID типа активности, связанной с тестом
}

export interface ChapterProgress {
  id: string; // chapter id (e.g. 'ch01')
  timeSpent: number; // in seconds
  completed: boolean;
  lastPosition?: number; // optional scroll position
  completedAt?: string;
}

export interface ChapterWithContent extends Chapter {
  content: string;
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
export interface ActivityProgress {
  id: string; // activity id
  timeSpent: number; // in seconds
  completedAt?: string;
}
