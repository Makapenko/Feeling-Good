import chaptersData from '../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../types/chapters.types';
import { chapterToActivitiesMap } from '../data/activitiesMapping';
import type { SpecialContent } from '../types/progress.types';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

/**
 * Определяет следующую главу для разблокировки после завершения текущей
 */
export const getNextChapterToUnlock = (completedChapterId: string): string | null => {
  // Находим текущую главу в структуре данных
  const currentMainChapter = typedChaptersData.chapters.find(ch => {
    // Проверяем, является ли это главной главой или подглавой
    if (ch.id === completedChapterId) return true;
    return ch.sections.some(section => section.id === completedChapterId);
  });
  
  if (!currentMainChapter) {
    return null;
  }

  // Если это подглава, проверяем, нужно ли разблокировать следующую
  const currentSectionIndex = currentMainChapter.sections.findIndex(s => s.id === completedChapterId);
  
  if (currentSectionIndex !== -1 && currentSectionIndex < currentMainChapter.sections.length - 1) {
    // Есть следующая подглава - возвращаем её
    return currentMainChapter.sections[currentSectionIndex + 1].id;
  } else if (currentSectionIndex === currentMainChapter.sections.length - 1 || currentMainChapter.sections.length === 0) {
    // Это последняя подглава или глава без подглав - ищем следующую главу
    const currentChapterIndex = typedChaptersData.chapters.findIndex(ch => ch.id === currentMainChapter.id);
    if (currentChapterIndex !== -1 && currentChapterIndex < typedChaptersData.chapters.length - 1) {
      return typedChaptersData.chapters[currentChapterIndex + 1].id;
    }
  }
  
  return null;
};

/**
 * Получает список активностей, связанных с главой
 */
export const getChapterActivities = (chapterId: string): SpecialContent[] => {
  return chapterToActivitiesMap[chapterId] || [];
};

/**
 * Определяет контент для разблокировки после завершения главы
 */
export const getUnlockContentForChapter = (completedChapterId: string) => {
  const nextChapter = getNextChapterToUnlock(completedChapterId);
  const newActivities = nextChapter ? getChapterActivities(nextChapter) : [];
  
  return {
    nextChapter,
    newActivities
  };
}; 
