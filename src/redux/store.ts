import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import progressReducer from './slices/progressSlice';
import mobileReducer from './slices/mobileSlice';
import notificationReducer, { notificationMiddleware } from './slices/notificationSlice';
import { STORAGE_KEY } from './constants';
import { ChapterWithContent, UserProgress } from './types';
// Middleware для управления сохранением в localStorage
const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Получаем текущее состояние после выполнения действия
  const state = store.getState().progress as UserProgress;
  
  // Клонируем состояние для сохранения
  const stateForStorage = JSON.parse(JSON.stringify(state));
  
  // Убираем контент из currentChapter если он есть
  if (stateForStorage.currentChapter) {
    const { id, title, timeSpent, completed } = stateForStorage.currentChapter;
    stateForStorage.currentChapter = { id, title, timeSpent, completed } as ChapterWithContent;
  }
  
  // Сохраняем в localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateForStorage));
  
  return result;
};

// Функция для загрузки начального состояния из localStorage
const getInitialStateFromStorage = (): UserProgress | undefined => {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      
      // Преобразуем старый формат в новый, если нужно
      let chapters = parsed.chapters || [];
      
      // Если есть chapters с полем content, создаем новый массив без content
      if (chapters.length > 0 && 'content' in chapters[0]) {
        chapters = chapters.map(({ id, title, timeSpent, completed }: { id: string; title: string; timeSpent: number; completed: boolean }) => ({
          id, title, timeSpent, completed
        }));
      }
      
      // Убедимся, что все необходимые поля существуют
      return {
        ...parsed,
        chapters,
        unlockedContent: parsed.unlockedContent || {
          chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
          activities: []
        },
        completedChapters: parsed.completedChapters || [],
        favoriteActivities: parsed.favoriteActivities || [],
        lastUnlockedChapter: null,
        lastUnlockedActivities: []
      };
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  
  return undefined;
};

// Загружаем начальное состояние
const preloadedState = getInitialStateFromStorage();

// Создаем хранилище
export const store = configureStore({
  reducer: {
    progress: progressReducer,
    mobile: mobileReducer,
    notification: notificationReducer
  },
  preloadedState: preloadedState ? { progress: preloadedState } : undefined,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Отключаем проверку сериализуемости для поддержки сложных объектов
    }).concat([localStorageMiddleware, notificationMiddleware])
});

// Экспортируем persistor для возможного использования в будущем
export const persistor = persistStore(store);

// Типы
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
