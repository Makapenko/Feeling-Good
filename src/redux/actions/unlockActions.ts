import { createAsyncThunk } from '@reduxjs/toolkit';
import { unlockAllContent, unlockContent } from '../slices/progressSlice';
import { addNotification } from '../slices/notificationSlice';
import { getUnlockContentForChapter, findChapterData } from '../../utils/chapterUtils';
import type { RootState } from '../types';

/**
 * Разблокирует контент, связанный с завершением главы
 * Уведомления о новых заданиях показывает компонент UnlockNotifier
 */
export const unlockContentAfterChapter = createAsyncThunk(
  'progress/unlockContentAfterChapter',
  async (completedChapterId: string, { dispatch, getState }) => {
    // Определяем что нужно разблокировать
    const { nextChapter, newActivities } = getUnlockContentForChapter(completedChapterId);

    // Разблокируем следующую главу, если она есть
    if (nextChapter) {
      const state = getState() as RootState;
      const unlockedChapters = state.progress.unlockedContent.chapters;

      // Разблокируем подглаву/главу
      if (!unlockedChapters.includes(nextChapter)) {
        dispatch(unlockContent({ contentId: nextChapter, contentType: 'chapter' }));
      }

      // Если разблокируемая глава — подглава, разблокируем также родительскую главу
      const chapterData = findChapterData(nextChapter);
      if (chapterData && !chapterData.isMainChapter) {
        const parentId = chapterData.chapter.id;
        if (!unlockedChapters.includes(parentId)) {
          dispatch(unlockContent({ contentId: parentId, contentType: 'chapter' }));
        }
      }
    }

    return { completedChapterId, nextChapter, newActivities };
  }
);

/**
 * Разблокирует весь доступный контент в приложении
 * Показывает уведомление о разблокировке всего контента
 */
export const unlockAll = createAsyncThunk(
  'progress/unlockAll',
  async (_, { dispatch }) => {
    // Разблокируем весь контент
    dispatch(unlockAllContent());
    
    // Отправляем уведомление о разблокировке всего контента
    dispatch(addNotification({
      message: 'Все задания теперь доступны!',
      type: 'success',
      duration: 6000
    }));
    
    return true;
  }
); 
