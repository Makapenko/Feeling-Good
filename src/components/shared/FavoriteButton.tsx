import React from 'react';
import { SpecialContent } from '../../types/progress.types';
import styles from './FavoriteButton.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavoriteActivity } from '../../redux/slices/progressSlice';

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
  const favoriteActivities = useAppSelector(state => state.progress.favoriteActivities);
  
  // Получаем статус избранного
  const isFavorite = favoriteActivities?.includes(activityId) || false;
  
  // Добавление или удаление из избранного через Redux
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteActivity(activityId));
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
