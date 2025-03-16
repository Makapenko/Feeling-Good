// import { DailyProgress } from './../types/progress.types';
import {
  UserProgress,
  ChapterProgress,
  SpecialContent,
  Chapter,
  DayProgress,
  TestResult,
  Exercise
} from '../types/progress.types';
import { getCurrentDate } from '../utils/dateUtils';
import chaptersData from '../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../types/chapters.types';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

export type ProgressAction =
  | { type: 'SET_CURRENT_CHAPTER'; chapter: Chapter | null }
  | { type: 'START_CHAPTER_READING'; chapterId: string }
  | { type: 'UPDATE_CHAPTER_PROGRESS'; chapterId: string; timeSpent: number }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string }
  | { type: 'SET_SPECIAL_CONTENT'; content: SpecialContent | null }
  | { type: 'SAVE_TEST_RESULT'; result: TestResult }
  | { type: 'SAVE_EXERCISE'; exercise: Exercise }
  | { type: 'UNLOCK_ALL_CONTENT' }
  | { type: 'UNLOCK_CONTENT'; contentId: string; contentType: 'chapter' | 'activity' };

export function progressReducer(
  state: UserProgress,
  action: ProgressAction
): UserProgress {
  const currentDate = getCurrentDate();
  const todayProgress: DayProgress = state.dailyProgress[currentDate] || {
    chapters: {},
    exercises: {
      testResults: [],
      exercises: []
    }
  };

  switch (action.type) {
    case 'SET_CURRENT_CHAPTER': {
      if (!action.chapter) {
        return {
          ...state,
          currentChapter: null,
          specialContent: null,
        };
      }

      const chapters = state.chapters || [];
      const existingChapterIndex = chapters.findIndex(
        (ch) => ch.id === action.chapter.id
      );
      const updatedChapters = [...chapters];

      const todayTimeSpent =
        todayProgress.chapters[action.chapter.id]?.timeSpent || 0;

      const newChapter: Chapter = {
        ...action.chapter,
        timeSpent: todayTimeSpent,
      };

      if (existingChapterIndex !== -1) {
        updatedChapters[existingChapterIndex] = {
          ...newChapter,
          timeSpent: chapters[existingChapterIndex].timeSpent,
        };
      } else {
        updatedChapters.push(newChapter);
      }

      return {
        ...state,
        currentChapter: newChapter,
        chapters: updatedChapters,
        specialContent: null,
      };
    }

    case 'START_CHAPTER_READING':
      if (
        !state.currentChapter ||
        state.currentChapter.id !== action.chapterId
      ) {
        return state;
      }
      return {
        ...state,
        currentChapter: {
          ...state.currentChapter,
          timeSpent: todayProgress.chapters[action.chapterId]?.timeSpent || 0,
        },
      };

    case 'UPDATE_CHAPTER_PROGRESS': {
      if (
        !state.currentChapter ||
        state.currentChapter.id !== action.chapterId
      ) {
        return state;
      }

      const updatedCurrentChapter = {
        ...state.currentChapter,
        timeSpent: action.timeSpent,
      };

      const chapters = state.chapters || [];
      const chaptersWithUpdatedTime = chapters.map((ch) =>
        ch.id === action.chapterId ? { ...ch, timeSpent: action.timeSpent } : ch
      );

      const currentChapterProgress = todayProgress.chapters[
        action.chapterId
      ] || {
        id: action.chapterId,
        timeSpent: 0,
        completed: false,
      };

      const updatedTodayProgress: DayProgress = {
        ...todayProgress,
        chapters: {
          ...todayProgress.chapters,
          [action.chapterId]: {
            ...currentChapterProgress,
            timeSpent: action.timeSpent,
          },
        },
      };

      return {
        ...state,
        currentChapter: updatedCurrentChapter,
        chapters: chaptersWithUpdatedTime,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: updatedTodayProgress,
        },
      };
    }

    case 'COMPLETE_CHAPTER': {
      if (
        !state.currentChapter ||
        state.currentChapter.id !== action.chapterId
      ) {
        return state;
      }

      const completedChapterProgress: ChapterProgress = {
        id: action.chapterId,
        timeSpent: state.currentChapter.timeSpent,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      const updatedTodayProgress: DayProgress = {
        ...todayProgress,
        chapters: {
          ...todayProgress.chapters,
          [action.chapterId]: completedChapterProgress,
        },
      };

      const chapters = state.chapters || [];
      const chaptersWithCompleted = chapters.map((ch) =>
        ch.id === action.chapterId ? { ...ch, completed: true } : ch
      );

      // Добавляем главу в список завершенных, если её там ещё нет
      const updatedCompletedChapters = state.completedChapters.includes(action.chapterId)
        ? state.completedChapters
        : [...state.completedChapters, action.chapterId];

      let updatedUnlockedContent = state.unlockedContent;

      // Находим текущую главу в структуре данных
      const currentMainChapter = typedChaptersData.chapters.find(ch => {
        // Проверяем, является ли это главной главой или подглавой
        if (ch.id === action.chapterId) return true;
        return ch.sections.some(section => section.id === action.chapterId);
      });

      if (currentMainChapter) {
        // Если это подглава, проверяем, нужно ли разблокировать следующую
        const currentSectionIndex = currentMainChapter.sections.findIndex(s => s.id === action.chapterId);
        
        if (currentSectionIndex !== -1 && currentSectionIndex < currentMainChapter.sections.length - 1) {
          // Есть следующая подглава - разблокируем её
          const nextSection = currentMainChapter.sections[currentSectionIndex + 1];
          if (!state.unlockedContent.chapters.includes(nextSection.id)) {
            updatedUnlockedContent = {
              ...state.unlockedContent,
              chapters: [...state.unlockedContent.chapters, nextSection.id]
            };
          }
        } else if (currentSectionIndex === currentMainChapter.sections.length - 1 || currentMainChapter.sections.length === 0) {
          // Это последняя подглава или глава без подглав - разблокируем следующую главу
          const currentChapterIndex = typedChaptersData.chapters.findIndex(ch => ch.id === currentMainChapter.id);
          if (currentChapterIndex !== -1 && currentChapterIndex < typedChaptersData.chapters.length - 1) {
            const nextChapter = typedChaptersData.chapters[currentChapterIndex + 1];
            if (!state.unlockedContent.chapters.includes(nextChapter.id)) {
              updatedUnlockedContent = {
                ...state.unlockedContent,
                chapters: [...state.unlockedContent.chapters, nextChapter.id]
              };
            }
          }
        }
      }

      return {
        ...state,
        currentChapter: null,
        chapters: chaptersWithCompleted,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: updatedTodayProgress,
        },
        unlockedContent: updatedUnlockedContent,
        completedChapters: updatedCompletedChapters
      };
    }

    case 'SET_SPECIAL_CONTENT':
      return {
        ...state,
        specialContent: action.content,
        currentChapter: null,
      };

    case 'SAVE_TEST_RESULT': {
      const currentTests = todayProgress.exercises.testResults || [];

      const existingTestIndex = currentTests.findIndex(
        (test) =>
          test.id === action.result.id &&
          test.completedAt.split('T')[0] === action.result.completedAt.split('T')[0]
      );

      const updatedTestResults = [...currentTests];

      if (existingTestIndex !== -1) {
        updatedTestResults[existingTestIndex] = action.result;
      } else {
        updatedTestResults.push(action.result);
      }

      return {
        ...state,
        dailyProgress: {
          ...state.dailyProgress,
          [currentDate]: {
            ...todayProgress,
            exercises: {
              ...todayProgress.exercises,
              testResults: updatedTestResults,
            },
          },
        },
      };
    }

    case 'SAVE_EXERCISE': {
      // Определяем дату для сохранения
      const targetDate = action.exercise.type === 'daily-schedule' 
        ? action.exercise.date 
        : currentDate;

      const targetDayProgress = state.dailyProgress[targetDate] || {
        chapters: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };

      const existingExerciseIndex = targetDayProgress.exercises.exercises.findIndex(
        (exercise) =>
          exercise.id === action.exercise.id
      );

      const updatedExercises = [...targetDayProgress.exercises.exercises];

      if (existingExerciseIndex !== -1) {
        updatedExercises[existingExerciseIndex] = action.exercise;
      } else {
        updatedExercises.push(action.exercise);
      }

      return {
        ...state,
        dailyProgress: {
          ...state.dailyProgress,
          [targetDate]: {
            ...targetDayProgress,
            exercises: {
              ...targetDayProgress.exercises,
              exercises: updatedExercises,
            },
          },
        },
      };
    }

    case 'UNLOCK_ALL_CONTENT': {
      // Собираем все ID глав и подглав из chapters.json
      const allChapterIds = typedChaptersData.chapters.flatMap(chapter => {
        const ids = [chapter.id];
        if (chapter.sections) {
          ids.push(...chapter.sections.map(section => section.id));
        }
        return ids;
      });
      
      return {
        ...state,
        unlockedContent: {
          ...state.unlockedContent,
          chapters: [...allChapterIds, 'all'], // Добавляем все ID и маркер 'all'
          activities: []
        }
      };
    }

    case 'UNLOCK_CONTENT': {
      const { contentId, contentType } = action;
      const contentArrayKey = contentType === 'chapter' ? 'chapters' : 'activities';
      const contentArray = state.unlockedContent[contentArrayKey];
      
      if (!contentArray.includes(contentId)) {
        return {
          ...state,
          unlockedContent: {
            ...state.unlockedContent,
            [contentArrayKey]: [...contentArray, contentId]
          }
        };
      }
      return state;
    }

    default:
      return state;
  }
}
