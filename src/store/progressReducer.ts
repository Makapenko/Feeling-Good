import { UserProgress, ChapterProgress, SpecialContent, Chapter, DayProgress } from '../types/progress.types';
import { getCurrentDate } from '../utils/dateUtils';

export type ProgressAction =
  | { type: 'SET_CURRENT_CHAPTER'; chapter: Chapter }
  | { type: 'START_CHAPTER_READING'; chapterId: string }
  | { type: 'UPDATE_CHAPTER_PROGRESS'; chapterId: string; timeSpent: number }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string }
  | { type: 'SET_SPECIAL_CONTENT'; content: SpecialContent | null };

export function progressReducer(state: UserProgress, action: ProgressAction): UserProgress {
  const currentDate = getCurrentDate();
  const todayProgress: DayProgress = state.dailyProgress[currentDate] || {
    chapters: {},
    exercises: []
  };

  switch (action.type) {
    case 'SET_CURRENT_CHAPTER': {
      const chapters = state.chapters || [];
      const existingChapterIndex = chapters.findIndex(ch => ch.id === action.chapter.id);
      const updatedChapters = [...chapters];
      
      const todayTimeSpent = todayProgress.chapters[action.chapter.id]?.timeSpent || 0;
      
      const newChapter = {
        ...action.chapter,
        timeSpent: todayTimeSpent
      };
      
      if (existingChapterIndex !== -1) {
        updatedChapters[existingChapterIndex] = {
          ...newChapter,
          timeSpent: chapters[existingChapterIndex].timeSpent
        };
      } else {
        updatedChapters.push(newChapter);
      }

      return {
        ...state,
        currentChapter: newChapter,
        chapters: updatedChapters,
        specialContent: null
      };
    }

    case 'START_CHAPTER_READING':
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }
      return {
        ...state,
        currentChapter: {
          ...state.currentChapter,
          timeSpent: todayProgress.chapters[action.chapterId]?.timeSpent || 0
        }
      };

    case 'UPDATE_CHAPTER_PROGRESS': {
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }

      const updatedCurrentChapter = {
        ...state.currentChapter,
        timeSpent: action.timeSpent
      };

      const chapters = state.chapters || [];
      const chaptersWithUpdatedTime = chapters.map(ch =>
        ch.id === action.chapterId ? { ...ch, timeSpent: action.timeSpent } : ch
      );

      const currentChapterProgress = todayProgress.chapters[action.chapterId] || {
        id: action.chapterId,
        timeSpent: 0,
        completed: false
      };

      const updatedTodayProgress: DayProgress = {
        ...todayProgress,
        chapters: {
          ...todayProgress.chapters,
          [action.chapterId]: {
            ...currentChapterProgress,
            timeSpent: action.timeSpent
          }
        }
      };

      return {
        ...state,
        currentChapter: updatedCurrentChapter,
        chapters: chaptersWithUpdatedTime,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: updatedTodayProgress
        }
      };
    }

    case 'COMPLETE_CHAPTER': {
      if (!state.currentChapter || state.currentChapter.id !== action.chapterId) {
        return state;
      }
      
      const completedChapterProgress: ChapterProgress = {
        id: action.chapterId,
        timeSpent: state.currentChapter.timeSpent,
        completed: true,
        completedAt: new Date().toISOString()
      };

      const updatedTodayProgress: DayProgress = {
        ...todayProgress,
        chapters: {
          ...todayProgress.chapters,
          [action.chapterId]: completedChapterProgress
        }
      };

      const chapters = state.chapters || [];
      const chaptersWithCompleted = chapters.map(ch =>
        ch.id === action.chapterId ? { ...ch, completed: true } : ch
      );

      return {
        ...state,
        currentChapter: null,
        chapters: chaptersWithCompleted,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: updatedTodayProgress
        }
      };
    }

    case 'SET_SPECIAL_CONTENT':
      return {
        ...state,
        specialContent: action.content,
        currentChapter: null
      };

    default:
      return state;
  }
} 
