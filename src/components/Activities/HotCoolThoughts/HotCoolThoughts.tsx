import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise, SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.HOT_COOL_THOUGHTS;

const HotCoolThoughts: React.FC = () => {
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
      title="Остудите «горячие» мысли"
      description={
        "Этот метод поможет вам справиться с гневом и другими негативными эмоциями путем замены «горячих» мыслей более спокойными и конструктивными.\n\n" +
        "В левой колонке запишите свои эмоциональные, «горячие» мысли, которые вызывают у вас гнев, обиду, зависть или другие негативные чувства. Это могут быть автоматические мысли, которые приходят в голову в момент расстройства.\n\n" +
        "В правой колонке запишите более объективные и менее провокационные «прохладные» мысли, которые помогут вам успокоиться и посмотреть на ситуацию более рационально.\n\n" +
        "Техника помогает осознать внутренний диалог и заменить мысли, вызывающие сильные эмоции, на более конструктивные альтернативы."
      }
      leftColumnTitle="«Горячие» мысли"
      leftColumnPlaceholder="Запишите эмоциональные, вызывающие гнев или расстройство мысли..."
      rightColumnTitle="«Прохладные» мысли"
      rightColumnPlaceholder="Запишите более объективные, менее эмоциональные альтернативы..."
      showCognitiveDistortions={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default HotCoolThoughts; 
