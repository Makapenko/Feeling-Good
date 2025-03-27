import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';

const SHEET_ID = ACTIVITY_IDS.THREE_COLUMNS_METHOD;

const ThreeColumnsMethod: React.FC = () => {
  const dispatch = useAppDispatch();

  const favoriteButton = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: ThreeColumnsExercise = {
      type: ACTIVITY_IDS.THREE_COLUMNS_METHOD,
      id: result.id,
      name: result.name,
      completed: result.completed,
      completedAt: result.completedAt,
      records: result.records
    };

    dispatch(addExercise({ 
      exercise, 
      showNotification: false
    }));
  };

  return (
    <ThreeColumnsBase 
      title={ACTIVITY_NAMES[ACTIVITY_IDS.THREE_COLUMNS_METHOD]}
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

export default ThreeColumnsMethod;
