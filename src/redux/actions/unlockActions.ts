import { createAsyncThunk } from '@reduxjs/toolkit';
import { unlockAllContent, unlockContent } from '../slices/progressSlice';
import { addNotification } from '../slices/notificationSlice';

/**
 * Разблокирует контент, связанный с завершением главы
 * Уведомления о новых заданиях показывает компонент UnlockNotifier
 */
export const unlockContentAfterChapter = createAsyncThunk(
  'progress/unlockContentAfterChapter',
  async (chapterId: string, { dispatch }) => {
    // Разблокируем контент
    dispatch(unlockContent({ contentId: chapterId, contentType: 'chapter' }));
    
    // Не отправляем дублирующее уведомление здесь,
    // так как UnlockNotifier уже показывает подробное уведомление
    // с точным названием разблокированного задания
    
    return chapterId;
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
