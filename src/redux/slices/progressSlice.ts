import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SpecialContent,
  Exercise,
} from '../../types/progress.types';
import { TestResult, ChapterProgress, ChapterWithContent, Chapter } from '../types';
import { getCurrentDate, getCurrentISOTimestamp } from '../../utils/dateUtils';
import chaptersData from '../../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
import { chapterToActivitiesMap } from '../../data/activitiesMapping';
import type { DayProgress, RootState, UserProgress } from '../types';
import { ACTIVITY_IDS } from '../../constants/activities';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

const today = getCurrentDate();

// Используем тот же тип для состояния (для простоты)
type ProgressState = UserProgress;

// Обновляем initialState, добавляя initialState.favoriteChapters
const initialState: ProgressState = {
  currentChapter: null,
  specialContent: null,
  dailyProgress: {
    [today]: {
      chapters: {},
      activities: {},
      exercises: {
        testResults: [],
        exercises: []
      }
    }
  },
  chapters: [],
  unlockedContent: {
    chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
    activities: []
  },
  completedChapters: [],
  favoriteActivities: [],
  lastUnlockedChapter: null,
  lastUnlockedActivities: [],
  favoriteChapters: [], // Инициализируем пустым массивом
  reduxMigrationCompleted: true,
  readingHistory: {} // Добавляем пустой объект истории чтения
};

// Функция для определения вновь разблокированных активностей
export const getNewlyUnlockedActivities = (
  newlyUnlockedChapter: string
): SpecialContent[] => {
  // Получаем список активностей, связанных с новой главой
  const unlockedActivities = chapterToActivitiesMap[newlyUnlockedChapter] || [];
  return unlockedActivities;
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Установка текущей главы
    setCurrentChapter: (state, action: PayloadAction<ChapterWithContent | null>) => {
      const chapter = action.payload;
      
      if (!chapter) {
        state.currentChapter = null;
        state.specialContent = null;
        return;
      }

      const currentDate = getCurrentDate();
      const todayProgress: DayProgress = state.dailyProgress[currentDate] || {
        chapters: {},
        activities: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };
      
      const todayTimeSpent = todayProgress.chapters[chapter.id]?.timeSpent || 0;
      
      // Создаем объект без контента для хранения в списке глав
      const chapterForList: Chapter = {
        id: chapter.id,
        title: chapter.title,
        timeSpent: todayTimeSpent,
        completed: chapter.completed || false
      };
      
      // Обновляем currentChapter с контентом
      state.currentChapter = {
        ...chapter,
        timeSpent: todayTimeSpent
      };
      
      // Обновляем список глав
      const existingChapterIndex = state.chapters.findIndex(ch => ch.id === chapter.id);
      if (existingChapterIndex !== -1) {
        state.chapters[existingChapterIndex] = {
          ...chapterForList,
          timeSpent: state.chapters[existingChapterIndex].timeSpent
        };
      } else {
        state.chapters.push(chapterForList);
      }
      
      state.specialContent = null;
    },
    
    // Начало чтения главы
    startChapterReading: (state, action: PayloadAction<string>) => {
      const chapterId = action.payload;
      
      if (!state.currentChapter || state.currentChapter.id !== chapterId) {
        return;
      }
      
      const currentDate = getCurrentDate();
      const todayProgress = state.dailyProgress[currentDate] || {
        chapters: {},
        activities: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };
      
      state.currentChapter.timeSpent = todayProgress.chapters[chapterId]?.timeSpent || 0;
    },
    
    // Обновление прогресса чтения главы
    updateChapterProgress: (state, action: PayloadAction<{ chapterId: string; timeSpent: number }>) => {
      const { chapterId, timeSpent } = action.payload;
      
      if (!state.currentChapter || state.currentChapter.id !== chapterId) {
        return;
      }
      
      // Обновляем время в текущей главе
      state.currentChapter.timeSpent = timeSpent;
      
      // Обновляем время в списке глав
      const chapterIndex = state.chapters.findIndex(ch => ch.id === chapterId);
      if (chapterIndex !== -1) {
        state.chapters[chapterIndex].timeSpent = timeSpent;
      }
      
      // Сохраняем прогресс в ежедневной статистике
      const currentDate = getCurrentDate();
      const todayProgress = state.dailyProgress[currentDate] || {
        chapters: {},
        activities: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };
      
      const currentChapterProgress = todayProgress.chapters[chapterId] || {
        id: chapterId,
        timeSpent: 0,
        completed: false
      };
      
      // Обновляем сегодняшний прогресс
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = todayProgress;
      }
      
      state.dailyProgress[currentDate].chapters[chapterId] = {
        ...currentChapterProgress,
        timeSpent
      };
    },
    
    // Обновление времени, проведенного в активности
    updateActivityProgress: (state, action: PayloadAction<{ activityId: string; timeSpent: number }>) => {
      const { activityId, timeSpent } = action.payload;
      console.log(`Redux: обновление времени активности ${activityId}:`, timeSpent);
      
      // Сохраняем прогресс в ежедневной статистике
      const currentDate = getCurrentDate();
      const todayProgress = state.dailyProgress[currentDate] || {
        chapters: {},
        activities: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };
      
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = todayProgress;
      }
      
      // Инициализируем объект активностей, если его еще нет
      if (!state.dailyProgress[currentDate].activities) {
        state.dailyProgress[currentDate].activities = {};
      }
      
      // Обновляем или создаем запись для активности
      state.dailyProgress[currentDate].activities[activityId] = {
        id: activityId,
        timeSpent,
        completedAt: timeSpent > 0 ? getCurrentISOTimestamp() : undefined
      };
      
      console.log(`Redux: обновлено состояние для ${activityId}`, 
        state.dailyProgress[currentDate].activities[activityId]);
    },
    
    // Завершение чтения главы
    completeChapter: (state, action: PayloadAction<string>) => {
      const chapterId = action.payload;
      
      if (!state.currentChapter || state.currentChapter.id !== chapterId) {
        return;
      }
      
      const currentDate = getCurrentDate();
      const todayProgress = state.dailyProgress[currentDate] || {
        chapters: {},
        activities: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      };
      
      // Создаем запись о завершенной главе
      const completedChapterProgress: ChapterProgress = {
        id: chapterId,
        timeSpent: state.currentChapter.timeSpent,
        completed: true,
        completedAt: getCurrentISOTimestamp()
      };
      
      // Обновляем ежедневный прогресс
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = todayProgress;
      }
      
      state.dailyProgress[currentDate].chapters[chapterId] = completedChapterProgress;
      
      // Обновляем статус главы в списке глав
      const chapterIndex = state.chapters.findIndex(ch => ch.id === chapterId);
      if (chapterIndex !== -1) {
        state.chapters[chapterIndex].completed = true;
      }
      
      // Добавляем главу в список завершенных, если её там ещё нет
      if (!state.completedChapters.includes(chapterId)) {
        state.completedChapters.push(chapterId);
      }
      
      // Сбрасываем текущую главу
      state.currentChapter = null;
      
      // Определяем разблокированное содержимое
      let newlyUnlockedChapter = '';
      
      // Находим текущую главу в структуре данных
      const currentMainChapter = typedChaptersData.chapters.find(ch => {
        // Проверяем, является ли это главной главой или подглавой
        if (ch.id === chapterId) return true;
        return ch.sections.some(section => section.id === chapterId);
      });
      
      if (currentMainChapter) {
        // Если это подглава, проверяем, нужно ли разблокировать следующую
        const currentSectionIndex = currentMainChapter.sections.findIndex(s => s.id === chapterId);
        
        if (currentSectionIndex !== -1 && currentSectionIndex < currentMainChapter.sections.length - 1) {
          // Есть следующая подглава - разблокируем её
          const nextSection = currentMainChapter.sections[currentSectionIndex + 1];
          if (!state.unlockedContent.chapters.includes(nextSection.id)) {
            newlyUnlockedChapter = nextSection.id;
            state.unlockedContent.chapters.push(nextSection.id);
          }
        } else if (currentSectionIndex === currentMainChapter.sections.length - 1 || currentMainChapter.sections.length === 0) {
          // Это последняя подглава или глава без подглав - разблокируем следующую главу
          const currentChapterIndex = typedChaptersData.chapters.findIndex(ch => ch.id === currentMainChapter.id);
          if (currentChapterIndex !== -1 && currentChapterIndex < typedChaptersData.chapters.length - 1) {
            const nextChapter = typedChaptersData.chapters[currentChapterIndex + 1];
            if (!state.unlockedContent.chapters.includes(nextChapter.id)) {
              newlyUnlockedChapter = nextChapter.id;
              state.unlockedContent.chapters.push(nextChapter.id);
            }
          }
        }
      }
      
      // Получаем список новых активностей, связанных с разблокированной главой
      state.lastUnlockedChapter = newlyUnlockedChapter || null;
      state.lastUnlockedActivities = newlyUnlockedChapter ? getNewlyUnlockedActivities(newlyUnlockedChapter) : [];
    },
    
    // Установка специального контента (активности)
    setSpecialContent: (state, action: PayloadAction<SpecialContent | null>) => {
      state.specialContent = action.payload;
      state.currentChapter = null;
    },
    
    // Сохранение результата теста
    saveTestResult: (state, action: PayloadAction<TestResult>) => {
      const result = action.payload;
      const currentDate = getCurrentDate();
      
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = {
          chapters: {},
          activities: {},
          exercises: {
            testResults: [],
            exercises: []
          }
        };
      }
      
      const currentTests = state.dailyProgress[currentDate].exercises.testResults || [];
      const existingTestIndex = currentTests.findIndex(
        test => test.id === result.id && 
        test.completedAt.split('T')[0] === result.completedAt.split('T')[0]
      );
      
      if (existingTestIndex !== -1) {
        state.dailyProgress[currentDate].exercises.testResults[existingTestIndex] = result;
      } else {
        state.dailyProgress[currentDate].exercises.testResults.push(result);
      }
    },
    
    // Сохранение упражнения
    saveExercise: (state, action: PayloadAction<Exercise>) => {
      const exercise = action.payload;
      
      // Определяем дату для сохранения
      const targetDate = 'date' in exercise && exercise.type === ACTIVITY_IDS.DAILY_SCHEDULE
        ? exercise.date 
        : getCurrentDate();
      
      if (!state.dailyProgress[targetDate]) {
        state.dailyProgress[targetDate] = {
          chapters: {},
          activities: {},
          exercises: {
            testResults: [],
            exercises: []
          }
        };
      }
      
      const existingExerciseIndex = state.dailyProgress[targetDate].exercises.exercises.findIndex(
        (ex: Exercise) => ex.id === exercise.id
      );
      
      if (existingExerciseIndex !== -1) {
        state.dailyProgress[targetDate].exercises.exercises[existingExerciseIndex] = exercise;
      } else {
        state.dailyProgress[targetDate].exercises.exercises.push(exercise);
      }
    },
    
    // Разблокировка всего содержимого
    unlockAllContent: (state) => {
      // Собираем все ID глав и подглав из chapters.json
      const allChapterIds = typedChaptersData.chapters.flatMap(chapter => {
        const ids = [chapter.id];
        if (chapter.sections) {
          ids.push(...chapter.sections.map(section => section.id));
        }
        return ids;
      });
      
      state.unlockedContent.chapters = [...allChapterIds, 'all'];
    },
    
    // Разблокировка конкретного контента
    unlockContent: (state, action: PayloadAction<{ contentId: string; contentType: 'chapter' | 'activity' }>) => {
      const { contentId, contentType } = action.payload;
      const contentArrayKey = contentType === 'chapter' ? 'chapters' : 'activities';
      
      if (!state.unlockedContent[contentArrayKey].includes(contentId)) {
        state.unlockedContent[contentArrayKey].push(contentId);
        
        // Если разблокируем главу, проверяем какие активности будут разблокированы
        if (contentType === 'chapter') {
          state.lastUnlockedChapter = contentId;
          state.lastUnlockedActivities = getNewlyUnlockedActivities(contentId);
        }
      }
    },
    
    // Добавление/удаление активности из избранного
    toggleFavoriteActivity: (state, action: PayloadAction<string>) => {
      const activityId = action.payload;
      const favoriteActivities = state.favoriteActivities || [];
      
      if (favoriteActivities.includes(activityId)) {
        // Удаляем из избранного
        state.favoriteActivities = favoriteActivities.filter(id => id !== activityId);
      } else {
        // Добавляем в избранное
        state.favoriteActivities.push(activityId);
      }
    },
    
    // Сброс информации о недавно разблокированном контенте
    resetNewlyUnlocked: (state) => {
      state.lastUnlockedChapter = null;
      state.lastUnlockedActivities = [];
    },

    // Загрузка состояния из localStorage (используется в middleware)
    loadStateFromStorage: (_state, action: PayloadAction<UserProgress>) => {
      return action.payload;
    },

    // Добавление/удаление главы из избранного
    toggleFavoriteChapter: (state, action: PayloadAction<{ chapterId: string; chapterTitle: string }>) => {
      const { chapterId, chapterTitle } = action.payload;
      
      // Убедимся, что массив избранных глав существует
      if (!state.favoriteChapters) {
        state.favoriteChapters = [];
      }
      
      // Проверяем, есть ли глава в избранном
      const existingIndex = state.favoriteChapters.findIndex(chapter => chapter.id === chapterId);
      
      if (existingIndex >= 0) {
        // Если глава уже в избранном, удаляем её
        state.favoriteChapters = state.favoriteChapters.filter(chapter => chapter.id !== chapterId);
      } else {
        // Если главы нет в избранном, добавляем её
        state.favoriteChapters.push({ id: chapterId, title: chapterTitle });
      }
    },
  }
});

// Экспорт actions и reducer
export const { 
  setCurrentChapter,
  startChapterReading,
  updateChapterProgress,
  updateActivityProgress,
  completeChapter,
  setSpecialContent,
  saveTestResult,
  saveExercise,
  unlockAllContent,
  unlockContent,
  toggleFavoriteActivity,
  resetNewlyUnlocked,
  loadStateFromStorage,
  toggleFavoriteChapter
} = progressSlice.actions;

// Селекторы
export const selectProgress = (state: RootState) => state.progress;
export const selectCurrentChapter = (state: RootState) => state.progress.currentChapter;
export const selectSpecialContent = (state: RootState) => state.progress.specialContent;
export const selectDailyProgress = (state: RootState) => state.progress.dailyProgress;
export const selectChapters = (state: RootState) => state.progress.chapters;
export const selectUnlockedContent = (state: RootState) => state.progress.unlockedContent;
export const selectCompletedChapters = (state: RootState) => state.progress.completedChapters;
export const selectFavoriteActivities = (state: RootState) => state.progress.favoriteActivities;
export const selectLastUnlockedChapter = (state: RootState) => state.progress.lastUnlockedChapter;
export const selectLastUnlockedActivities = (state: RootState) => state.progress.lastUnlockedActivities;
export const selectFavoriteChapters = (state: RootState) => state.progress.favoriteChapters;

export default progressSlice.reducer; 
