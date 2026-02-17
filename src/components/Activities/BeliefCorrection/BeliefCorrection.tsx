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

const SHEET_ID: SpecialContent = ACTIVITY_IDS.BELIEF_CORRECTION;

const BeliefCorrection: React.FC = () => {
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
      title="Корректировка убеждения"
      description={
        "Это упражнение поможет вам вести внутренний диалог между зависимой и независимой частями вашей личности.\n\n" +
        "В левой колонке запишите обвинения вашего зависимого «Я» — мысли, которые убеждают вас, что без любви и одобрения вы ничего не стоите.\n\n" +
        "В правой колонке запишите контраргументы вашего независимого «Я» — рациональные ответы, которые помогут вам обрести уверенность и самодостаточность."
      }
      leftColumnTitle='Обвинения моего зависимого «Я»'
      leftColumnPlaceholder="Например: «Если она меня бросит, я буду одинок навсегда»"
      rightColumnTitle='Контраргументы моего независимого «Я»'
      rightColumnPlaceholder="Например: «Одиночество — это временное состояние, а не приговор. Я могу построить полноценную жизнь и без этих отношений»"
      showCognitiveDistortions={false}
      showMiddleColumn={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default BeliefCorrection;
