import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { NoLoseTechniqueExercise } from '../../../types/progress.types';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.NO_LOSE_TECHNIQUE;

const NoLoseTechnique: React.FC = () => {
  const { dispatch } = useProgress();

  const favoriteButton = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: NoLoseTechniqueExercise = {
      type: SHEET_ID,
      id: SHEET_ID,
      name: ACTIVITY_NAMES[ACTIVITY_IDS.NO_LOSE_TECHNIQUE],
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
      title={ACTIVITY_NAMES[ACTIVITY_IDS.NO_LOSE_TECHNIQUE]}
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
