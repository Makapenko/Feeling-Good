import React, { useMemo } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';

const SHEET_ID = 'three-columns-method';
const ACTIVITY_NAME = 'Метод трёх колонок';

const ThreeColumnsMethod: React.FC = () => {
  const { progress, dispatch } = useProgress();

  // Получаем статус избранного из Redux
  const isFavorite = useMemo(() => {
    return progress.favoriteActivities?.includes(SHEET_ID) || false;
  }, [progress.favoriteActivities]);

  // Добавление или удаление из избранного через Redux
  const toggleFavorite = () => {
    dispatch({
      type: 'TOGGLE_FAVORITE_ACTIVITY',
      activityId: SHEET_ID
    });
  };

  const favoriteButton = (
    <button 
      className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      ★
    </button>
  );

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: ThreeColumnsExercise = {
      type: 'three-columns-method',
      id: result.id,
      name: result.name,
      completed: result.completed,
      completedAt: result.completedAt,
      records: result.records
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  return (
    <ThreeColumnsBase
      title={ACTIVITY_NAME}
      description="Запишите свои автоматические мысли и найдите им более рациональную альтернативу"
      leftColumnTitle="Автоматическая мысль"
      leftColumnPlaceholder="Запишите вашу негативную мысль... (самокритика)"
      rightColumnTitle="Рациональный ответ"
      rightColumnPlaceholder="Запишите более объективную мысль... (самозащита)"
      showCognitiveDistortions={true}
      methodId={SHEET_ID}
      onSave={handleSave}
      favoriteButton={favoriteButton}
    />
  );
}; 

export default ThreeColumnsMethod
