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

const SHEET_ID: SpecialContent = ACTIVITY_IDS.SELF_CRITICISM_RESPONSE;

const SelfCriticismResponse: React.FC = () => {
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
      title="Ответы на самокритику"
      description={
        "Запишите худшие оскорбления и издевки, которые можете адресовать себе, а затем дайте на них ответ.\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "ПРИМЕР 1\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "Критик: «Ты не так трудолюбив или успешен, как большинство друзей. Ты ленив и ни на что не годен.»\n\n" +
        "Вы: «Это означает, что я менее амбициозен и трудолюбив. Возможно, даже менее талантлив, но как из этого следует, что я ленив и ни на что не годен?»\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "ПРИМЕР 2\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "Критик: «Ты непопулярен, у тебя нет близких друзей. Ты неудачник.»\n\n" +
        "Вы: «Возможно, у меня неважные навыки общения, и над этим придётся работать. Но как из этого следует, что я неудачник?»"
      }
      leftColumnTitle="Критик"
      leftColumnPlaceholder="Например: «Ты немногого стоишь, потому что ни в чём не достиг выдающихся результатов»"
      rightColumnTitle="Ваш ответ"
      rightColumnPlaceholder="Например: «Согласен, что у меня довольно средние успехи. Но как из этого следует, что я немногого стою?»"
      showCognitiveDistortions={false}
      showMiddleColumn={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default SelfCriticismResponse;
