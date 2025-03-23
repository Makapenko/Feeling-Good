import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { SpecialContent } from '../../types/progress.types';
import { useProgress } from '../../store/ProgressContext';
import { getRelatedChapter, getChapterTitle, getChapterPath } from '../../data/chaptersMapping';
import styles from './ChapterLinkButton.module.css';

interface ChapterLinkButtonProps {
  activityId: SpecialContent;
  className?: string;
}

/**
 * Кнопка для перехода к главе, связанной с текущей активностью
 * @param activityId ID активности, для которой нужно найти соответствующую главу
 * @param className Дополнительный класс для стилизации кнопки
 */
const ChapterLinkButton: React.FC<ChapterLinkButtonProps> = ({ 
  activityId,
  className = ''
}) => {
  const { dispatch } = useProgress();
  
  // Получаем ID главы, связанной с активностью
  const chapterId = getRelatedChapter(activityId);
  
  // Если нет связанной главы, не отображаем кнопку
  if (!chapterId) return null;
  
  const openRelatedChapter = async () => {
    try {
      // Получаем путь к файлу с содержимым главы
      const chapterPath = getChapterPath(chapterId);
      if (!chapterPath) {
        console.error(`Path not found for chapter ${chapterId}`);
        return;
      }
      
      const response = await fetch(chapterPath);
      const content = await response.text();
      
      dispatch({
        type: 'SET_CURRENT_CHAPTER',
        chapter: {
          id: chapterId,
          title: getChapterTitle(chapterId),
          content,
          timeSpent: 0,
          completed: false
        }
      });
    } catch (error) {
      console.error('Error loading chapter:', error);
    }
  };
  
  return (
    <button
      className={`${styles.chapterButton} ${className}`}
      onClick={openRelatedChapter}
      aria-label="Открыть описание методики"
      title="Открыть главу с описанием методики"
    >
      <FontAwesomeIcon icon={faBook} />
    </button>
  );
};

export default ChapterLinkButton; 
