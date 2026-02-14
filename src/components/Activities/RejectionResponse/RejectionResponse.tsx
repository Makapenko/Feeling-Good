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

const SHEET_ID: SpecialContent = ACTIVITY_IDS.REJECTION_RESPONSE;

const RejectionResponse: React.FC = () => {
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
      title="Рациональные ответы на неодобрение"
      description={
        "Каждый день выделяйте 5–10 минут, чтобы впустить в мысли всю печаль и отчаяние, которые у вас накопились. " +
        "Когда отведённое время закончится — остановитесь и продолжайте жить как обычно.\n\n" +
        "Запишите негативные мысли, которые возникают при отвержении или неодобрении. " +
        "Определите когнитивные искажения и замените их рациональными ответами."
      }
      leftColumnTitle="Негативная мысль при отвержении"
      leftColumnPlaceholder="Например: «Если она меня отвергла, значит, я никому не нужен»"
      rightColumnTitle="Рациональный ответ"
      rightColumnPlaceholder="Например: «Один отказ не определяет мою ценность. У этого человека могут быть свои причины»"
      showCognitiveDistortions={true}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default RejectionResponse;
