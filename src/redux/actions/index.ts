// Экспорт all actions из файлов группы
export * from './chapterActions';
export * from './activityActions';
export * from './unlockActions';

// Экспортируем избранные действия отдельно, чтобы избежать конфликта имен
import { toggleFavoriteChapter } from './favoriteActions';
import { loadChapter, completeChapterWithUnlock } from './chapterActions';

export { toggleFavoriteChapter, loadChapter, completeChapterWithUnlock }; 
