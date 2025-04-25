import { STORAGE_KEY } from './constants';
import { UserProgress } from './types';
import { store } from './store';
import { loadStateFromStorage } from './slices/progressSlice';

/**
 * Функция для миграции данных из старого формата в новый Redux формат
 * Запускается при инициализации приложения
 */
export const migrateDataToRedux = (): void => {
  try {
    // Проверяем наличие данных в старом формате
    const oldStorageData = localStorage.getItem(STORAGE_KEY);
    
    if (oldStorageData) {
      const parsedData = JSON.parse(oldStorageData);
      
      // Проверяем, является ли это данными в старом формате
      // и не был ли уже произведен импорт в Redux
      const isLegacyData = parsedData && 
        !parsedData.reduxMigrationCompleted && 
        (parsedData.currentChapter || 
         parsedData.chapters?.length > 0 || 
         parsedData.completedChapters?.length > 0);
      
      if (isLegacyData) {
        // Преобразуем старый формат в новый
        let chapters = parsedData.chapters || [];
        
        // Если есть chapters с полем content, создаем новый массив без content
        if (chapters.length > 0 && 'content' in chapters[0]) {
          chapters = chapters.map(
            ({ id, title, timeSpent, completed }: { id: string; title: string; timeSpent: number; completed: boolean }) => ({
              id, title, timeSpent, completed
            })
          );
        }
        
        // Если есть currentChapter, удаляем content
        let currentChapter = parsedData.currentChapter;
        if (currentChapter) {
          const { id, title, timeSpent, completed } = currentChapter;
          currentChapter = { id, title, timeSpent, completed };
        }
        
        // Создаем объект с данными для Redux
        const migratedData: UserProgress = {
          ...parsedData,
          chapters,
          currentChapter,
          unlockedContent: parsedData.unlockedContent || {
            chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
            activities: []
          },
          completedChapters: parsedData.completedChapters || [],
          favoriteActivities: parsedData.favoriteActivities || [],
          lastUnlockedChapter: null,
          lastUnlockedActivities: [],
          reduxMigrationCompleted: true
        };
        
        // Загружаем данные в Redux
        store.dispatch(loadStateFromStorage(migratedData));
        
        // Обновляем данные в localStorage с меткой о миграции
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...migratedData,
          reduxMigrationCompleted: true
        }));
        
        console.log('Migration to Redux completed successfully');
      }
    }
  } catch (error) {
    console.error('Error during migration to Redux:', error);
  }
}; 
