import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { SpecialContent } from '../../types/progress.types';
import { getRelatedChapter } from '../../data/chaptersMapping';
import styles from './ChapterLinkButton.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { loadChapter } from '../../redux/actions';

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
  const dispatch = useAppDispatch();
  
  // Получаем ID главы, связанной с активностью
  const chapterId = getRelatedChapter(activityId);
  
  // Если нет связанной главы, не отображаем кнопку
  if (!chapterId) return null;
  
  const openRelatedChapter = () => {
    // Используем action для загрузки главы
    dispatch(loadChapter(chapterId));
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
