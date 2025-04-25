import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../ThreeColumnsBase/types';
import { SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.RATIONAL_RESPONSES;

const RationalResponses: React.FC = () => {
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
      title="Рациональные ответы на самокритику"
      description={
        "Эта техника поможет вам противостоять негативным самокритичным мыслям, которые вызывают депрессию и снижают самооценку.\n\n" +
        "В левой колонке запишите негативные мысли, которые вы говорите себе в моменты уныния, самокритики или сомнения в себе. Это могут быть утверждения, которые вы считаете правдой о себе.\n\n" +
        "В правой колонке сформулируйте более объективный и реалистичный ответ на эту самокритику. Подумайте, как бы вы ответили близкому другу, который скажет о себе такие слова. Не позволяйте двойным стандартам определять ваше отношение к себе.\n\n" +
        "Обратите внимание на искажения в своих негативных мыслях: обесценивание положительного, мышление «всё или ничего», негативный фильтр, преувеличение и другие когнитивные искажения."
      }
      leftColumnTitle="Негативные мысли (самокритика)"
      leftColumnPlaceholder="Запишите самокритичную мысль, которая вызывает уныние или снижает самооценку..."
      rightColumnTitle="Рациональные ответы (самозащита)"
      rightColumnPlaceholder="Запишите более объективный и сбалансированный ответ на эту критику..."
      showCognitiveDistortions={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default RationalResponses; 
