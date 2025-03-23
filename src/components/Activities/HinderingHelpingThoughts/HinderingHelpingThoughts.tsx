import React, { useMemo } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';

const SHEET_ID = 'hindering-helping-thoughts';
const ACTIVITY_NAME = 'Техника мешающих и помогающих мыслей';

const HinderingHelpingThoughts: React.FC = () => {
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
      description="Замените мешающие мысли на помогающие, чтобы улучшить свою мотивацию и продуктивность"
      leftColumnTitle="Мешающая мысль"
      leftColumnPlaceholder="Запишите мысль, которая мешает вам действовать..."
      rightColumnTitle="Помогающая мысль"
      rightColumnPlaceholder="Замените её на более конструктивную мысль..."
      showCognitiveDistortions={true}
      methodId={SHEET_ID}
      onSave={handleSave}
      favoriteButton={favoriteButton}
    />
  );
};

export default HinderingHelpingThoughts;
