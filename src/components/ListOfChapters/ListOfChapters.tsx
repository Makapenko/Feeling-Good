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
    return Object.values(progress.dailyProgress).some(dayProgress => {
      return dayProgress.chapters[subchapterId]?.completed ?? false;
    });
  };

  // Проверяет, завершена ли последняя подглава главы
  const isLastSubchapterCompleted = (chapter: Chapter): boolean => {
    if (!chapter.sections || chapter.sections.length === 0) {
      return isSubchapterCompleted(chapter.id);
    }
    const lastSection = chapter.sections[chapter.sections.length - 1];
    return isSubchapterCompleted(lastSection.id);
  };

  // Проверяет доступность подглавы
  const isSubchapterAvailable = (chapter: Chapter, sectionIndex: number): boolean => {
    // Первая подглава всегда доступна, если доступна сама глава
    if (sectionIndex === 0) {
      return isChapterAvailable(chapter.id);
    }

    // Для остальных подглав проверяем завершенность предыдущей
    const prevSection = chapter.sections[sectionIndex - 1];
    return isSubchapterCompleted(prevSection.id);
  };

  const isChapterAvailable = (chapterId: string): boolean => {
    // Вступительные материалы всегда доступны
    if (chapterId === 'acknowledgments' || chapterId === 'foreword' || chapterId === 'introduction') {
      return true;
    }
    
    // Первая глава всегда доступна
    if (chapterId === 'ch1') return true;
    
    // Для остальных глав проверяем завершенность предыдущей
    const chapterNumber = parseInt(chapterId.slice(2));
    const prevChapterId = `ch${chapterNumber - 1}`;
    
    // Находим предыдущую главу
    const prevChapter = typedChaptersData.chapters.find(ch => ch.id === prevChapterId);
    if (!prevChapter) return false;

    // Проверяем завершенность последней подглавы предыдущей главы
    return isLastSubchapterCompleted(prevChapter);
  };

  // Проверяет, завершены ли все подглавы главы
  const areAllSubchaptersCompleted = (chapter: Chapter): boolean => {
    if (!chapter.sections || chapter.sections.length === 0) {
      return isSubchapterCompleted(chapter.id);
    }
    return chapter.sections.every(section => isSubchapterCompleted(section.id));
  };

  const handleChapterClick = async (path: string | undefined, chapterId: string, title: string) => {
    console.log('Clicking chapter:', chapterId);
    
    if (path) {
      try {
        console.log('Fetching from path:', path);
        const response = await fetch(path);
        const content = await response.text();
        console.log('Loaded content length:', content.length);
        
        dispatch({
          type: 'SET_CURRENT_CHAPTER',
          chapter: {
            id: chapterId,
            title: title,
            content,
            timeSpent: 0,
            completed: false
          }
        });
      } catch (error) {
        console.error(`Error loading chapter: ${error}`);
      }
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
                          {chapter.sections.map((section: Section, index) => (
                            <li
                              key={section.id}
                              onClick={() => 
                                isSubchapterAvailable(chapter, index) && 
                                handleChapterClick(section.path, section.id, section.title)
                              }
                              className={`
                                ${styles.sectionItem} 
                                ${!isSubchapterAvailable(chapter, index) ? styles.disabled : ''}
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
