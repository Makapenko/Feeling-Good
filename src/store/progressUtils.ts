import { UserProgress } from '../types/progress.types';

export const STORAGE_KEY = 'userProgress';

/**
 * Мигрирует сохраненные данные прогресса, удаляя поле content из объектов Chapter
 * для уменьшения размера хранилища
 */
export function migrateStoredProgress(): void {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      let isModified = false;

      // Удаляем content из currentChapter
      if (parsed.currentChapter && 'content' in parsed.currentChapter) {
        delete parsed.currentChapter.content;
        isModified = true;
      }

      // Удаляем content из массива chapters
      if (parsed.chapters && Array.isArray(parsed.chapters)) {
        for (const chapter of parsed.chapters) {
          if ('content' in chapter) {
            delete chapter.content;
            isModified = true;
          }
        }
      }

      // Сохраняем обновленные данные, если были изменения
      if (isModified) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        console.log('Migrated stored progress by removing content fields');
      }
    } catch (error) {
      console.error('Error migrating stored progress:', error);
    }
  }
}

export function getInitialState(): UserProgress {
  // Сначала мигрируем данные, если нужно
  migrateStoredProgress();
  
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      // Убедимся, что все необходимые поля существуют
      return {
        ...parsed,
        unlockedContent: parsed.unlockedContent || {
          chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
          activities: []
        },
        completedChapters: parsed.completedChapters || [],
        favoriteActivities: parsed.favoriteActivities || [],
        lastUnlockedChapter: null,
        lastUnlockedActivities: []
      };
    } catch (e) {
      console.error('Error parsing saved progress:', e);
    }
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return {
    currentChapter: null,
    specialContent: null,
    dailyProgress: {
      [today]: {
        chapters: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      }
    },
    chapters: [],
    unlockedContent: {
      chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
      activities: []
    },
    completedChapters: [],
    favoriteActivities: [],
    lastUnlockedChapter: null,
    lastUnlockedActivities: []
  };
} 
