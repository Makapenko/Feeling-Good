import React, { useMemo } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { NoLoseTechniqueExercise } from '../../../types/progress.types';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';

const SHEET_ID = 'no-lose-technique';
const ACTIVITY_NAME = 'Беспроигрышная техника';

const NoLoseTechnique: React.FC = () => {
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
    const exercise: NoLoseTechniqueExercise = {
      type: 'no-lose-technique',
      id: SHEET_ID,
      name: ACTIVITY_NAME,
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
      description="Составьте список негативных последствий, с которыми вы можете столкнуться, если пойдете на риск и действительно проиграете. Затем сконцентрируйтесь на искажениях, лежащих в основе ваших страхов, и покажите, как вы можете эффективно справиться с ними, даже если вас постигнет разочарование."
      leftColumnTitle="Негативные последствия"
      leftColumnPlaceholder="Запишите возможные негативные последствия, если вы рискнете и потерпите неудачу..."
      rightColumnTitle="Позитивные мысли и стратегии"
      rightColumnPlaceholder="Как вы можете эффективно справиться с этими последствиями, даже если потерпите неудачу..."
      showCognitiveDistortions={true}
      methodId={SHEET_ID}
      onSave={handleSave}
      favoriteButton={favoriteButton}
    />
  );
};

export default NoLoseTechnique;
