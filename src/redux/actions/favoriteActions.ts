import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SpecialContent } from '../../types/progress.types';
import { toggleFavoriteChapter as toggleChapterFavorite } from '../slices/progressSlice';
import { addNotification } from '../slices/notificationSlice';
import { RootState } from '../types';

// Типы действий для работы с избранными активностями и главами
export const TOGGLE_FAVORITE_ACTIVITY = 'favorite/toggleActivity';
export const TOGGLE_FAVORITE_CHAPTER = 'favorite/toggleChapter';

// Интерфейсы для параметров действий
interface ToggleFavoriteActivityPayload {
  activityId: SpecialContent;
  showNotification?: boolean;
}

interface ToggleFavoriteChapterPayload {
  chapterId: string;
  chapterTitle: string;
  showNotification?: boolean;
}

// Действия для управления избранными активностями
export const toggleFavoriteActivity = createAction<ToggleFavoriteActivityPayload>(
  TOGGLE_FAVORITE_ACTIVITY
);

/**
 * Переключает главу в избранное/из избранного
 */
export const toggleFavoriteChapter = createAsyncThunk(
  'progress/toggleFavoriteChapter',
  async (
    { chapterId, chapterTitle, showNotification = true }: ToggleFavoriteChapterPayload, 
    { dispatch, getState }
  ) => {
    // Переключаем статус избранного
    dispatch(toggleChapterFavorite({ chapterId, chapterTitle }));
    
    if (showNotification) {
      // Проверяем, добавлена ли глава в избранное
      const state = getState() as RootState;
      const isFavorite = state.progress.favoriteChapters.some(
        chapter => chapter.id === chapterId
      );
      
      // Отправляем уведомление в зависимости от статуса
      dispatch(addNotification({
        message: isFavorite 
          ? 'Глава добавлена в избранное' 
          : 'Глава удалена из избранного',
        type: 'success',
        duration: 2000
      }));
    }
    
    return { chapterId, chapterTitle };
  }
); 
