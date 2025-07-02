import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentChapter, completeChapter } from '../slices/progressSlice';
import { getChapterTitle, getChapterFullPath, findChapterData } from '../../utils/chapterUtils';
import { unlockContentAfterChapter } from './unlockActions';

/**
 * Загружает главу из файла и устанавливает её как текущую
 */
export const loadChapter = createAsyncThunk(
  'progress/loadChapter',
  async (chapterId: string, { dispatch, rejectWithValue }) => {
    try {
      // Проверяем, можно ли загрузить эту главу
      const chapterData = findChapterData(chapterId);
      if (!chapterData) {
        return rejectWithValue(`Глава ${chapterId} не найдена`);
      }

      // Проверяем, есть ли у главы path для загрузки
      const hasPath = chapterData.isMainChapter 
        ? !!chapterData.chapter.path 
        : !!chapterData.section?.path;

      if (!hasPath) {
        return rejectWithValue(`Глава ${chapterId} не имеет контента для загрузки`);
      }

      // Получаем заголовок и путь к файлу главы с помощью утилит
      const chapterTitle = getChapterTitle(chapterId);
      const chapterPath = getChapterFullPath(chapterId);
      
      console.log('Загрузка главы по пути:', chapterPath);
      
      const response = await fetch(chapterPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
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
      return rejectWithValue(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  }
);

/**
 * Завершает главу і разблокирует связанный с ней контент
 */
export const completeChapterWithUnlock = createAsyncThunk(
  'progress/completeChapterWithUnlock',
  async (chapterId: string, { dispatch }) => {
    // Отмечаем главу как завершенную
    dispatch(completeChapter(chapterId));
    
    // Разблокируем новый контент и показываем уведомления
    dispatch(unlockContentAfterChapter(chapterId));
    
    return chapterId;
  }
); 
