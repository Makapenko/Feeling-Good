// Экспорт all actions из файлов группы
export * from './chapterActions';
export * from './activityActions';
export * from './unlockActions';

// Экспортируем избранные действия отдельно, чтобы избежать конфликта имен
import { toggleFavoriteChapter } from './favoriteActions';
import { completeChapterAsync } from './chapterActions';

export { toggleFavoriteChapter, completeChapterAsync as completeChapter }; 
