import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS;

const HinderingHelpingThoughts: React.FC = () => {
  const { dispatch } = useProgress();

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

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  return (
    <ThreeColumnsBase
      title={ACTIVITY_NAMES[ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS]}
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
