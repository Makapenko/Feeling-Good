import { UserProgress, DailyProgress, ChapterProgress, Exercise, SpecialContent, Chapter } from '../types/progress.types';
import { getCurrentDate } from '../utils/dateUtils';

export type ProgressAction =
  | { type: 'SET_CURRENT_CHAPTER'; chapter: Chapter }
  | { type: 'START_CHAPTER_READING'; chapterId: string }
  | { type: 'UPDATE_CHAPTER_PROGRESS'; chapterId: string; timeSpent: number }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string }
  | { type: 'SET_SPECIAL_CONTENT'; content: SpecialContent | null };

export function progressReducer(state: UserProgress, action: ProgressAction): UserProgress {
  const currentDate = getCurrentDate();
  const todayProgress: DailyProgress = state.dailyProgress[currentDate] || {
    date: currentDate,
    chapters: {},
    exercises: []
  };

  switch (action.type) {
    case 'SET_CURRENT_CHAPTER':
      return {
        ...state,
        currentChapter: action.chapter,
        specialContent: null
      };

    case 'START_CHAPTER_READING':
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }
      return {
        ...state,
        currentChapter: {
          ...state.currentChapter,
          timeSpent: 0
        }
      };

    case 'UPDATE_CHAPTER_PROGRESS':
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }
      return {
        ...state,
        currentChapter: {
          ...state.currentChapter,
          timeSpent: action.timeSpent
        }
      };

    case 'COMPLETE_CHAPTER':
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }
      
      // Создаем прогресс для завершенной главы
      const completedChapterProgress: ChapterProgress = {
        id: action.chapterId,
        timeSpent: state.currentChapter.timeSpent,
        completed: true,
        completedAt: new Date().toISOString()
      };

      // Обновляем прогресс текущего дня
      const updatedTodayProgress = {
        ...todayProgress,
        chapters: {
          ...todayProgress.chapters,
          [action.chapterId]: completedChapterProgress
        }
      };

      return {
        ...state,
        currentChapter: null,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: updatedTodayProgress
        }
      };

    case 'SET_SPECIAL_CONTENT':
      return {
        ...state,
        specialContent: action.content,
        currentChapter: null
      };

    // Добавьте остальные case для других действий...

    default:
      return state;
  }
} 
