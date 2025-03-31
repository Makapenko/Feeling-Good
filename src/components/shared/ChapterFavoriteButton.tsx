import React from 'react';
import styles from './FavoriteButton.module.css';
import { useAppDispatch, useIsFavoriteChapter } from '../../redux/hooks';
import { toggleFavoriteChapter } from '../../redux/actions';

interface ChapterFavoriteButtonProps {
  chapterId: string;
  chapterTitle: string;
  className?: string;
}

/**
 * Кнопка для добавления главы в избранное
 * @param chapterId ID главы, которую нужно добавить/убрать из избранного
 * @param chapterTitle Название главы для отображения
 * @param className Дополнительный класс для стилизации кнопки
 */
const ChapterFavoriteButton: React.FC<ChapterFavoriteButtonProps> = ({ 
  chapterId,
  chapterTitle,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const isFavorite = useIsFavoriteChapter(chapterId);
  
  // Добавление или удаление из избранного через Redux без уведомления
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события, чтобы не активировать родительские элементы
    dispatch(toggleFavoriteChapter({
      chapterId,
      chapterTitle,
      showNotification: true
    }));
  };
  
  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''} ${className}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Удалить главу из избранного" : "Добавить главу в избранное"}
      title={isFavorite ? "Удалить главу из избранного" : "Добавить главу в избранное"}
    >
      ★
    </button>
  );
};

export default ChapterFavoriteButton; 
