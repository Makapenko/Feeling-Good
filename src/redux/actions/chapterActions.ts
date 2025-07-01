import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setCurrentChapter, 
  completeChapter as completeChapterSliceAction
} from '../slices/progressSlice';
import { unlockContentAfterChapter } from './unlockActions';
import chaptersData from '../../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../../types/chapters.types';
// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

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
      
      // Устанавливаем главу как текущую (логика подготовки данных в slice)
      dispatch(setCurrentChapter({
        id: chapterId,
        title: chapterTitle,
        content,
        timeSpent: 0, // setCurrentChapter сам подготовит актуальное время
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
export const completeChapterAsync = createAsyncThunk(
  'progress/completeChapterAsync',
  async (chapterId: string, { dispatch }) => {
    // Отмечаем главу как завершенную
    dispatch(completeChapterSliceAction(chapterId));
    
    // Разблокируем новый контент и показываем уведомление
    dispatch(unlockContentAfterChapter(chapterId));
    
    return chapterId;
  }
); 
