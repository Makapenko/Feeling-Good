import { useProgress } from '../../store/ProgressContext';
import styles from './ListOfChapters.module.css';
import chaptersData from './chapters.json';
import { useState } from 'react';
import type { Chapter, ChaptersData, Section } from '../../types/chapters.types';

// Указываем тип для импортированных данных
const typedChaptersData = chaptersData as ChaptersData;

function ListOfChapters() {
  const { progress, dispatch } = useProgress();
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
    return progress.completedChapters.includes(subchapterId);
  };

  // Проверяет доступность главы
  const isChapterAvailable = (chapterId: string): boolean => {
    // Если есть маркер 'all', все доступно
    if (progress.unlockedContent?.chapters?.includes('all')) {
      return true;
    }
    return progress.unlockedContent?.chapters?.includes(chapterId) ?? false;
  };

  // Проверяет доступность подглавы
  const isSubchapterAvailable = (chapter: Chapter, sectionId: string): boolean => {
    // Если есть маркер 'all', все подглавы доступны
    if (progress.unlockedContent?.chapters?.includes('all')) {
      return true;
    }

    // Если глава недоступна, подглавы тоже недоступны
    if (!isChapterAvailable(chapter.id)) {
      return false;
    }

    // Проверяем, разблокирована ли конкретная подглава
    return progress.unlockedContent?.chapters?.includes(sectionId);
  };

  // Проверяет, завершены ли все подглавы главы
  const areAllSubchaptersCompleted = (chapter: Chapter): boolean => {
    if (!chapter.sections || chapter.sections.length === 0) {
      return isSubchapterCompleted(chapter.id);
    }
    return chapter.sections.every(section => isSubchapterCompleted(section.id));
  };

  const handleChapterClick = async (path: string | undefined, chapterId: string, title: string) => {
    if (path) {
      dispatch({
        type: 'SET_CURRENT_CHAPTER',
        chapter: {
          id: chapterId,
          title: title,
          timeSpent: 0,
          completed: false
        }
      });
    }
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
                          ${progress.currentChapter?.id === chapterId ? styles.active : ''}`}
                        onClick={() => toggleChapter(chapterId)}
                      >
                        <span>{chapter.title}</span>
                        <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
                      </div>
                      {isExpanded && (
                        <ul className={styles.subSections}>
                          {chapter.sections.map((section: Section) => (
                            <li
                              key={section.id}
                              onClick={() => 
                                isSubchapterAvailable(chapter, section.id) && 
                                handleChapterClick(section.path, section.id, section.title)
                              }
                              className={`
                                ${styles.sectionItem} 
                                ${!isSubchapterAvailable(chapter, section.id) ? styles.disabled : ''}
                                ${isSubchapterCompleted(section.id) ? styles.completed : ''}
                                ${progress.currentChapter?.id === section.id ? styles.active : ''}
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
                      onClick={() => isAvailable && handleChapterClick(chapter.path, chapter.id, chapter.title)}
                      className={`
                        ${styles.chapterItem} 
                        ${!isAvailable ? styles.disabled : ''}
                        ${isChapterCompleted ? styles.completed : ''}
                        ${progress.currentChapter?.id === chapter.id ? styles.active : ''}
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
