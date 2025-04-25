import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult, ThreeColumnsExercise } from '../ThreeColumnsBase/types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID = ACTIVITY_IDS.THREE_COLUMNS_METHOD;

const ThreeColumnsMethod: React.FC = () => {
  const dispatch = useAppDispatch();

  const actionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: ThreeColumnsExercise = {
      ...createBaseExercise(SHEET_ID, result.id),
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
      actionButtons={actionButtons}
    />
  );
};

export default ThreeColumnsMethod;
