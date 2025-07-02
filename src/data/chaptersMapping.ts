import { SpecialContent } from '../types/progress.types';
import { chapterToActivitiesMap } from './activitiesMapping';
import chaptersData from '../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../types/chapters.types';

// Типизация импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

/**
 * Обратный маппинг от активностей к главам
 * Используется для быстрого доступа к главам из активностей
 */
export const activitiesToChapterMap = Object.entries(chapterToActivitiesMap).reduce(
  (acc, [chapterId, activities]) => {
    activities.forEach(activityId => {
      acc[activityId] = chapterId;
    });
    return acc;
  },
  {} as Record<SpecialContent, string>
);

/**
 * Возвращает ID главы, связанной с указанной активностью
 * @param activityId ID активности
 * @returns ID главы или null, если активность не связана с главой
 */
export const getRelatedChapter = (activityId: SpecialContent): string | null => {
  return activitiesToChapterMap[activityId] || null;
};

/**
 * Создаем объект с заголовками глав из импортированных данных
 */
export const CHAPTER_TITLES: Record<string, string> = typedChaptersData.chapters.reduce(
  (acc, chapter) => {
    // Добавляем основную главу
    acc[chapter.id] = chapter.title;
    
    // Добавляем все подглавы, если они есть
    if (chapter.sections) {
      chapter.sections.forEach(section => {
        acc[section.id] = section.title;
      });
    }
    
    return acc;
  },
  {} as Record<string, string>
);

 
