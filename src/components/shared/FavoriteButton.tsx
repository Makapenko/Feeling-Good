import React from 'react';
import { SpecialContent } from '../../types/progress.types';
import { useProgress } from '../../store/ProgressContext';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  activityId: SpecialContent;
  className?: string;
}

/**
 * Кнопка для добавления активности в избранное
 * @param activityId ID активности, которую нужно добавить/убрать из избранного
 * @param className Дополнительный класс для стилизации кнопки
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  activityId,
  className = ''
}) => {
  const { progress, dispatch } = useProgress();
  
  // Получаем статус избранного
  const isFavorite = progress.favoriteActivities?.includes(activityId) || false;
  
  // Добавление или удаление из избранного через Redux
  const toggleFavorite = () => {
    dispatch({
      type: 'TOGGLE_FAVORITE_ACTIVITY',
      activityId
    });
  };
  
  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''} ${className}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      ★
    </button>
  );
};

export default FavoriteButton; 
