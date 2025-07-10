import styles from './ListOfChapters.module.css';
import chaptersData from './chapters.json';
import { useState } from 'react';
import type { Chapter, ChaptersData, Section } from '../../types/chapters.types';
import { useAppDispatch, useUnlockedContent, useCompletedChapters, useCurrentChapter } from '../../redux/hooks';
import { loadChapter } from '../../redux/actions';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

function ListOfChapters() {
  const dispatch = useAppDispatch();
  const unlockedContent = useUnlockedContent();
  const completedChapters = useCompletedChapters();
  const currentChapter = useCurrentChapter();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // Проверяет, завершена ли конкретная подглава
  const isSubchapterCompleted = (subchapterId: string): boolean => {
    return completedChapters.includes(subchapterId);
  };

  // Проверяет доступность главы
  const isChapterAvailable = (chapterId: string): boolean => {
    // Если есть маркер 'all', все доступно
    if (unlockedContent?.chapters?.includes('all')) {
      return true;
    }
    return unlockedContent?.chapters?.includes(chapterId) ?? false;
  };

  // Проверяет доступность подглавы
  const isSubchapterAvailable = (chapter: Chapter, sectionId: string): boolean => {
    // Если есть маркер 'all', все подглавы доступны
    if (unlockedContent?.chapters?.includes('all')) {
      return true;
    }

    // Если глава недоступна, подглавы тоже недоступны
    if (!isChapterAvailable(chapter.id)) {
      return false;
    }

    // Если это введение (первая подглава) и основная глава доступна, то введение тоже доступно
    const isIntroSection = chapter.sections?.[0]?.id === sectionId;
    if (isIntroSection) {
      return true;
    }

    // Проверяем, разблокирована ли конкретная подглава
    return unlockedContent?.chapters?.includes(sectionId);
  };

  // Проверяет, завершены ли все подглавы главы
  const areAllSubchaptersCompleted = (chapter: Chapter): boolean => {
    if (!chapter.sections || chapter.sections.length === 0) {
      return isSubchapterCompleted(chapter.id);
    }
    return chapter.sections.every(section => isSubchapterCompleted(section.id));
  };

  const handleChapterClick = (chapterId: string) => {
    dispatch(loadChapter(chapterId));
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Список глав:</h3>
      {typedChaptersData.sections.map((section) => (
        <div key={section.id}>
          <h4>{section.name}</h4>
          <ul>
            {section.chapters.map((chapterId) => {
              const chapter = typedChaptersData.chapters.find(ch => ch.id === chapterId);
              const isAvailable = isChapterAvailable(chapterId);
              
              if (!chapter) return null;

              const hasSubchapters = chapter.sections && chapter.sections.length > 1;
              const isExpanded = expandedChapters.has(chapterId);
              const isChapterCompleted = areAllSubchaptersCompleted(chapter);
              
                return (
                <li key={chapterId}>
                  {hasSubchapters ? (
                    <>
                      <div 
                        className={`${styles.chapterTitle} ${styles.accordion} 
                          ${isExpanded ? styles.expanded : ''} 
                          ${isChapterCompleted ? styles.completed : ''}
                          ${currentChapter?.id === chapterId ? styles.active : ''}`}
                        onClick={() => toggleChapter(chapterId)}
                      >
                        <span>{chapter.title}</span>
                        <span className={`${styles.arrow} ${isChapterCompleted ? styles.completedArrow : ''}`}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                      {isExpanded && (
                        <ul className={styles.subSections}>
                          {(chapter.sections || []).map((section: Section) => (
                            <li
                              key={section.id}
                              onClick={() => 
                                isSubchapterAvailable(chapter, section.id) && 
                                handleChapterClick(section.id)
                              }
                              className={`
                                ${styles.sectionItem} 
                                ${!isSubchapterAvailable(chapter, section.id) ? styles.disabled : ''}
                                ${isSubchapterCompleted(section.id) ? styles.completed : ''}
                                ${currentChapter?.id === section.id ? styles.active : ''}
                              `}
                            >
                              {section.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <div
                      onClick={() => isAvailable && handleChapterClick(chapter.id)}
                      className={`
                        ${styles.chapterItem} 
                        ${!isAvailable ? styles.disabled : ''}
                        ${isChapterCompleted ? styles.completed : ''}
                        ${currentChapter?.id === chapter.id ? styles.active : ''}
                      `}
                    >
                      {chapter.title}
                    </div>
                  )}
                  </li>
                );
              })}
            </ul>
          </div>
      ))}
    </aside>
  );
}

export default ListOfChapters;
