import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SpecialContent,
  Exercise,
} from '../../types/progress.types';
import { TestResult, ChapterProgress, ChapterWithContent, Chapter } from '../types';
import { getCurrentDate, getCurrentISOTimestamp, createEmptyDayProgress } from '../../utils/dateUtils';
import type { RootState, UserProgress } from '../types';
import { ACTIVITY_IDS } from '../../constants/activities';
import { getChapterActivities } from '../../utils/chapterUtils';
import chaptersData from '../../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';

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
    [today]: createEmptyDayProgress()
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

      // Подготавливаем данные главы с учетом текущего дневного прогресса
      const currentDate = getCurrentDate();
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = createEmptyDayProgress();
      }

      const todayTimeSpent = state.dailyProgress[currentDate].chapters[chapter.id]?.timeSpent || chapter.timeSpent || 0;

      // Обновляем currentChapter с актуальным временем
      state.currentChapter = {
        ...chapter,
        timeSpent: todayTimeSpent
      };
      
      // Обновляем список глав
      const chapterForList: Chapter = {
        id: chapter.id,
        title: chapter.title,
        timeSpent: todayTimeSpent,
        completed: chapter.completed || false
      };
      
      const existingChapterIndex = state.chapters.findIndex(ch => ch.id === chapter.id);
      if (existingChapterIndex !== -1) {
        state.chapters[existingChapterIndex] = chapterForList;
      } else {
        state.chapters.push(chapterForList);
      }
      
      state.specialContent = null;
    },
    
    // Начало чтения главы
    startChapterReading: (state, action: PayloadAction<string>) => {
      const chapterId = action.payload;
      const currentDate = getCurrentDate();
      
      // Инициализируем прогресс если нужно
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = createEmptyDayProgress();
      }

      // Получаем или инициализируем прогресс главы
      const timeSpent = state.dailyProgress[currentDate].chapters[chapterId]?.timeSpent || 0;

      // Обновляем или создаем запись для главы
      state.dailyProgress[currentDate].chapters[chapterId] = {
        id: chapterId,
        timeSpent,
        completed: false
      };
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
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = createEmptyDayProgress();
      }
      
      const currentChapterProgress = state.dailyProgress[currentDate].chapters[chapterId] || {
        id: chapterId,
        timeSpent: 0,
        completed: false
      };
      
      state.dailyProgress[currentDate].chapters[chapterId] = {
        ...currentChapterProgress,
        timeSpent
      };
    },
    
    // Обновление времени, проведенного в активности
    updateActivityProgress: (state, action: PayloadAction<{ activityId: string; timeSpent: number }>) => {
      const { activityId, timeSpent } = action.payload;
      
      // Сохраняем прогресс в ежедневной статистике
      const currentDate = getCurrentDate();
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = createEmptyDayProgress();
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
    },
    
    // Завершение чтения главы
    completeChapter: (state, action: PayloadAction<string>) => {
      const chapterId = action.payload;
      
      if (!state.currentChapter || state.currentChapter.id !== chapterId) {
        return;
      }
      
      const currentDate = getCurrentDate();
      if (!state.dailyProgress[currentDate]) {
        state.dailyProgress[currentDate] = createEmptyDayProgress();
      }
      
      // Создаем запись о завершенной главе
      const completedChapterProgress: ChapterProgress = {
        id: chapterId,
        timeSpent: state.currentChapter.timeSpent,
        completed: true,
        completedAt: getCurrentISOTimestamp()
      };
      
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
        state.dailyProgress[currentDate] = createEmptyDayProgress();
      }
      
      const currentTests = state.dailyProgress[currentDate].exercises.testResults;
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
      
      if (typeof targetDate !== 'string') {
        return; // Если targetDate не строка, прерываем выполнение
      }

      if (!state.dailyProgress[targetDate]) {
        state.dailyProgress[targetDate] = createEmptyDayProgress();
      }
      
      if (!state.dailyProgress[targetDate]?.exercises?.exercises) {
        return; // Если exercises не существует, прерываем выполнение
      }
      
      const exercises = state.dailyProgress[targetDate].exercises.exercises;
      const existingExerciseIndex = exercises.findIndex(
        (ex: Exercise) => ex.id === exercise.id
      );
      
      if (existingExerciseIndex !== -1) {
        exercises[existingExerciseIndex] = exercise;
      } else {
        exercises.push(exercise);
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
          state.lastUnlockedActivities = getChapterActivities(contentId);
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
