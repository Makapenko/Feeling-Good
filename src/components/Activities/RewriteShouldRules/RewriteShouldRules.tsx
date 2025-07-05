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

const SHEET_ID: SpecialContent = ACTIVITY_IDS.REWRITE_SHOULD_RULES;


const RewriteShouldRules: React.FC = () => {
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
      title="Пересмотр правил со словом «должен»"
      description={
        "Эта техника поможет вам пересмотреть нереалистичные правила и ожидания, которые вызывают гнев, разочарование и напряжение в отношениях.\n\n" +
        "В левой колонке запишите деструктивное правило, содержащее слово «должен». Это могут быть утверждения о том, что другие люди должны вести себя определенным образом или что вы сами должны соответствовать неким жестким стандартам.\n\n" +
        "В правой колонке сформулируйте более реалистичную и гибкую версию этого правила. Вместо слова «должен» используйте фразы вроде «было бы хорошо, если» или «я предпочел(а) бы».\n\n" +
        "Такой пересмотр помогает отказаться от тиранических требований и принять неизбежное несовершенство мира и людей, что ведет к большему спокойствию и удовлетворению."
      }
      leftColumnTitle="Деструктивное правило со словом «должен»"
      leftColumnPlaceholder="Запишите правило, которое вызывает гнев или разочарование..."
      rightColumnTitle="Исправленная версия"
      rightColumnPlaceholder="Сформулируйте более реалистичную и гибкую версию..."
      showCognitiveDistortions={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default RewriteShouldRules; 
