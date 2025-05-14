import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { ThreeColumnsExercise } from '../ThreeColumnsBase/types';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.VERBAL_JUDO;

const VerbalJudo: React.FC = () => {
  const dispatch = useAppDispatch();

  const actionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const handleSave = (result: ThreeColumnsMethodResult) => {
    // Сохраняем упражнение в более общем формате ThreeColumnsExercise
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
      title={ACTIVITY_NAMES[SHEET_ID]}
      description={
        "Критика со стороны может вызывать негативные эмоции из-за нашей интерпретации. " +
        "В этом упражнении вы научитесь распознавать негативные мысли, возникающие в ответ на критику, " +
        "и формулировать более рациональные ответы.\n\n" +
        "В левой колонке запишите ситуацию, когда вас критиковали или критикуют.\n\n" +
        "В правой колонке запишите рациональный ответ, который позволит вам эффективно реагировать на критику, " +
        "не теряя самоуважения."
      }
      leftColumnTitle="Критика"
      leftColumnPlaceholder="Опишите ситуацию, когда вас критиковали или критикуют..."
      rightColumnTitle="Рациональный ответ"
      rightColumnPlaceholder="Напишите рациональный ответ на критику..."
      showCognitiveDistortions={false}
      showMiddleColumn={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default VerbalJudo; 
