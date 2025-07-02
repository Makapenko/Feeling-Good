import chaptersData from '../components/ListOfChapters/chapters.json';
import type { ChaptersData } from '../types/chapters.types';
import { chapterToActivitiesMap } from '../data/activitiesMapping';
import type { SpecialContent } from '../types/progress.types';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

/**
 * Ищет главу по ID (может быть основная глава или подглава)
 */
export const findChapterData = (chapterId: string) => {
  // Сначала ищем как основную главу
  const mainChapter = typedChaptersData.chapters.find(ch => ch.id === chapterId);
  if (mainChapter) {
    return {
      chapter: mainChapter,
      section: null,
      isMainChapter: true
    };
  }

  // Если не нашли как основную главу, ищем как подглаву
  for (const chapter of typedChaptersData.chapters) {
    if (chapter.sections) {
      const section = chapter.sections.find(s => s.id === chapterId);
      if (section) {
        return {
          chapter,
          section,
          isMainChapter: false
        };
      }
    }
  }

  return null;
};

/**
 * Получает заголовок главы по ID
 */
export const getChapterTitle = (chapterId: string): string => {
  const chapterData = findChapterData(chapterId);
  if (!chapterData) {
    return chapterId; // Fallback к ID, если не найдено
  }

  return chapterData.isMainChapter 
    ? chapterData.chapter.title 
    : (chapterData.section?.title || chapterId);
};

/**
 * Получает путь к файлу главы с базовым URL
 */
export const getChapterFullPath = (chapterId: string): string => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const chapterData = findChapterData(chapterId);
  
  if (!chapterData) {
    // Fallback к стандартному пути
    return `${baseUrl}content/chapters/${chapterId}.html`;
  }

  let relativePath: string;
  
  if (chapterData.isMainChapter) {
    // Для основной главы берем её path (если он есть)
    if (!chapterData.chapter.path) {
      throw new Error(`Глава ${chapterId} не имеет path и не может быть загружена напрямую`);
    }
    relativePath = chapterData.chapter.path;
  } else {
    // Для подглавы берем path из секции
    if (!chapterData.section?.path) {
      throw new Error(`Подглава ${chapterId} не имеет path`);
    }
    relativePath = chapterData.section.path;
  }

  // Убираем начальный слеш если он есть, чтобы избежать двойных слешей
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }

  return `${baseUrl}${relativePath}`;
};

/**
 * Определяет следующую главу для разблокировки после завершения текущей
 */
export const getNextChapterToUnlock = (completedChapterId: string): string | null => {
  // Находим текущую главу в структуре данных
  const currentMainChapter = typedChaptersData.chapters.find(ch => {
    // Проверяем, является ли это главной главой или подглавой
    if (ch.id === completedChapterId) return true;
    return ch.sections?.some(section => section.id === completedChapterId);
  });
  
  if (!currentMainChapter) {
    return null;
  }

  // Если это подглава, проверяем, нужно ли разблокировать следующую
  const currentSectionIndex = currentMainChapter.sections?.findIndex(s => s.id === completedChapterId) ?? -1;
  
  if (currentSectionIndex !== -1 && currentMainChapter.sections) {
    if (currentSectionIndex < currentMainChapter.sections.length - 1) {
      // Есть следующая подглава - возвращаем её
      return currentMainChapter.sections[currentSectionIndex + 1].id;
    } else {
      // Это последняя подглава - ищем следующую главу
      const nextChapter = getNextMainChapter(currentMainChapter.id);
      if (nextChapter) {
        // Если следующая глава имеет подглавы, возвращаем первую подглаву
        if (nextChapter.sections && nextChapter.sections.length > 0) {
          return nextChapter.sections[0].id;
        }
        // Если следующая глава без подглав, возвращаем её ID
        return nextChapter.id;
      }
    }
  } else {
    // Это основная глава
    if (currentMainChapter.sections && currentMainChapter.sections.length > 0) {
      // Если у главы есть подглавы, возвращаем первую подглаву
      return currentMainChapter.sections[0].id;
    } else {
      // Если нет подглав, ищем следующую главу
      const nextChapter = getNextMainChapter(currentMainChapter.id);
      if (nextChapter) {
        // Если следующая глава имеет подглавы, возвращаем первую подглаву
        if (nextChapter.sections && nextChapter.sections.length > 0) {
          return nextChapter.sections[0].id;
        }
        // Если следующая глава без подглав, возвращаем её ID
        return nextChapter.id;
      }
    }
  }
  
  return null;
};

// Вспомогательная функция для получения следующей основной главы
const getNextMainChapter = (currentChapterId: string) => {
  const currentChapterIndex = typedChaptersData.chapters.findIndex(ch => ch.id === currentChapterId);
  if (currentChapterIndex !== -1 && currentChapterIndex < typedChaptersData.chapters.length - 1) {
    return typedChaptersData.chapters[currentChapterIndex + 1];
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
