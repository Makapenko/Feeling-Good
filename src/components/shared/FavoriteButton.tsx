import React from 'react';
import { SpecialContent } from '../../types/progress.types';
import styles from './FavoriteButton.module.css';
import { useAppDispatch, useIsFavoriteActivity } from '../../redux/hooks';
import { toggleFavoriteActivity } from '../../redux/actions';

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
  const dispatch = useAppDispatch();
  const isFavorite = useIsFavoriteActivity(activityId);
  
  // Добавление или удаление из избранного через Redux без уведомления
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteActivity({
      activityId,
      showNotification: true
    }));
  };
  
  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''} ${className}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      ★
    </button>
  );
};

export default FavoriteButton; 
