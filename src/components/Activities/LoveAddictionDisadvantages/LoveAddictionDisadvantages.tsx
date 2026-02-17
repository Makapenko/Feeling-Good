import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult, ThreeColumnsExercise } from '../ThreeColumnsBase/types';
import { SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.LOVE_ADDICTION_DISADVANTAGES;

const LoveAddictionDisadvantages: React.FC = () => {
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
      showNotification: true
    }));
  };

  return (
    <ThreeColumnsBase
      title="Недостатки любовной зависимости"
      description={
        "Это упражнение поможет вам осознать иррациональные убеждения, связанные с любовной зависимостью, и заменить их более здоровыми мыслями.\n\n" +
        "В левой колонке запишите убеждение, поддерживающее любовную зависимость — мысль о том, что без любви вы не можете быть счастливы.\n\n" +
        "В правой колонке запишите рациональный ответ — более реалистичное и здоровое убеждение."
      }
      leftColumnTitle="Убеждение, поддерживающее зависимость"
      leftColumnPlaceholder="Например: «Без любви моя жизнь пуста и бессмысленна»"
      rightColumnTitle="Рациональный ответ"
      rightColumnPlaceholder="Например: «Любовь обогащает жизнь, но я могу быть счастлив и без неё, занимаясь тем, что мне нравится»"
      showCognitiveDistortions={false}
      showMiddleColumn={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default LoveAddictionDisadvantages;
