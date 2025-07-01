import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setCurrentChapter, 
  updateChapterProgress,
  completeChapter as completeChapterAction,
  updateActivityProgress
} from '../slices/progressSlice';
import { unlockContentAfterChapter } from './unlockActions';
import chaptersData from '../../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
import { getCurrentDate, createEmptyDayProgress } from '../../utils/dateUtils';
import type { ChapterWithContent, DayProgress, RootState } from '../types';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

/**
 * Подготавливает данные главы и устанавливает её как текущую
 */
export const setChapter = createAsyncThunk(
  'progress/setChapter',
  async (chapter: ChapterWithContent | null, { dispatch, getState }) => {
    if (!chapter) {
      dispatch(setCurrentChapter(null));
      return;
    }

    const currentDate = getCurrentDate();
    const state = getState() as RootState;
    const todayProgress: DayProgress = state.progress.dailyProgress[currentDate] || createEmptyDayProgress();

    const todayTimeSpent = todayProgress.chapters[chapter.id]?.timeSpent || 0;

    // Создаем объект главы для установки
    const chapterToSet: ChapterWithContent = {
      ...chapter,
      timeSpent: todayTimeSpent
    };

    dispatch(setCurrentChapter(chapterToSet));
    return chapter.id;
  }
);

/**
 * Загружает главу из файла и устанавливает её как текущую
 */
export const loadChapter = createAsyncThunk(
  'progress/loadChapter',
  async (chapterId: string, { dispatch }) => {
    try {
      // Получаем базовый URL из конфигурации Vite
      const baseUrl = import.meta.env.BASE_URL || '/';
      
      // Ищем главу в данных, чтобы получить правильный путь к файлу
      const chapterData = typedChaptersData.chapters.find(chapter => 
        chapter.id === chapterId || chapter.sections.some(section => section.id === chapterId)
      );
      
      // Если нашли главу, используем путь из неё, иначе формируем стандартный путь
      let chapterPath;
      let chapterTitle = chapterId;
      
      if (chapterData) {
        // Если это ID секции, ищем секцию и берем её путь
        if (chapterId !== chapterData.id) {
          const section = chapterData.sections.find(section => section.id === chapterId);
          chapterPath = section?.path ? `${baseUrl}${section.path}` : `${baseUrl}content/chapters/${chapterId}.html`;
          chapterTitle = section?.title || chapterId;
        } else {
          // Если это главная глава, берем путь из неё
          chapterPath = chapterData.path ? `${baseUrl}${chapterData.path}` : `${baseUrl}content/chapters/${chapterId}.html`;
          chapterTitle = chapterData.title || chapterId;
        }
      } else {
        // Если не нашли главу, используем стандартный путь
        chapterPath = `${baseUrl}content/chapters/${chapterId}.html`;
      }
      
      console.log('Загрузка главы по пути:', chapterPath);
      
      const response = await fetch(chapterPath);
      const content = await response.text();
      
      // Устанавливаем главу как текущую через новый action
      await dispatch(setChapter({
        id: chapterId,
        title: chapterTitle,
        content,
        timeSpent: 0,
        completed: false
      }));
      
      return chapterId;
    } catch (error) {
      console.error('Error loading chapter:', error);
      throw error;
    }
  }
);

/**
 * Отмечает главу как завершенную и разблокирует новый контент
 */
export const completeChapter = createAsyncThunk(
  'progress/completeChapter',
  async (chapterId: string, { dispatch }) => {
    // Отмечаем главу как завершенную
    dispatch(completeChapterAction(chapterId));
    
    // Разблокируем новый контент и показываем уведомление
    dispatch(unlockContentAfterChapter(chapterId));
    
    return chapterId;
  }
);

/**
 * Обновляет время, проведенное в главе
 */
export const updateChapterTime = createAsyncThunk(
  'progress/updateChapterTime',
  async ({ chapterId, timeSpent }: { chapterId: string; timeSpent: number }, { dispatch }) => {
    dispatch(updateChapterProgress({ chapterId, timeSpent }));
    return { chapterId, timeSpent };
  }
);

/**
 * Обновляет время, проведенное в активности
 */
export const updateActivityTime = createAsyncThunk(
  'progress/updateActivityTime',
  async ({ activityId, timeSpent }: { activityId: string; timeSpent: number }, { dispatch }) => {
    dispatch(updateActivityProgress({ activityId, timeSpent }));
    return { activityId, timeSpent };
  }
);

/**
 * Инициализирует начало чтения главы
 */
export const startChapterReading = createAsyncThunk(
  'progress/startChapterReading',
  async (chapterId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const currentChapter = state.progress.currentChapter;

    if (!currentChapter || currentChapter.id !== chapterId) {
      return;
    }

    const currentDate = getCurrentDate();
    const todayProgress = state.progress.dailyProgress[currentDate] || createEmptyDayProgress();

    const timeSpent = todayProgress.chapters[chapterId]?.timeSpent || 0;
    
    // Обновляем время через существующий action
    dispatch(updateChapterProgress({ chapterId, timeSpent }));
    
    return { chapterId, timeSpent };
  }
); 
