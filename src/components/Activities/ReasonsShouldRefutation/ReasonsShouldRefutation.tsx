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

// Компонент для упражнения по опровержению "должен"-мышления (глава 7-9)
const SHEET_ID = ACTIVITY_IDS.REASONS_SHOULD_REFUTATION;

const ReasonsShouldRefutation: React.FC = () => {
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
      title={ACTIVITY_NAMES[SHEET_ID]}
      description={
        'В левой колонке перечислите причины, по которым вы считаете, что кто-то "должен" был поступить иначе или лучше выполнять свою работу. ' +
        'В правой колонке напишите рациональные опровержения этим причинам, чтобы снизить внутреннее напряжение и избавиться от завышенных ожиданий.'
      }
      leftColumnTitle="Причина, почему кто-то должен был стараться больше"
      leftColumnPlaceholder="Например: Потому что ему заплатили, потому что это правильно, потому что он должен..."
      rightColumnTitle="Рациональное опровержение"
      rightColumnPlaceholder="Например: Ему платят не за сверхусилия, не все считают нужным делать идеально и т.д."
      showCognitiveDistortions={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default ReasonsShouldRefutation; 
