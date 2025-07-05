// src/components/Activities/AdvantagesDisadvantages/AdvantagesDisadvantages.tsx
import React, { useState } from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { SpecialContent } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { ThreeColumnsExercise } from '../ThreeColumnsBase/types';

const SHEET_ID: SpecialContent = ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES;

const AdvantagesDisadvantages: React.FC = () => {
  const dispatch = useAppDispatch();
  // Состояние для хранения анализируемого убеждения
  const [belief, setBelief] = useState<string>('');

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
      records: result.records,
      metadata: { belief: belief }
    };

    dispatch(addExercise({ 
      exercise, 
      showNotification: true 
    }));
  };

  return (
    <div className={styles.container}>
      {/* Секция для ввода убеждения */}
      <div className={styles.beliefSection}>
        <label htmlFor="beliefInput">Убеждение для анализа:</label>
        <input
          id="beliefInput"
          type="text"
          value={belief}
          onChange={(e) => setBelief(e.target.value)}
          placeholder="Например: «Я всегда должна делать то, чего от меня ожидают»"
          className={styles.beliefInput}
        />
      </div>

      <ThreeColumnsBase 
        title="Анализ преимуществ и недостатков для оценки скрытых убеждений"
        description={
          "Этот метод помогает оценить полезность какого-либо убеждения. Спросите себя, в чем преимущества и недостатки следования этому убеждению?\n\n" +
          "В левой колонке перечислите все преимущества этого убеждения - как оно вам помогает.\n\n" +
          "В правой колонке перечислите все недостатки, негативные последствия или цену, которую вы платите за это убеждение.\n\n" +
          "Перечислив все варианты, как это убеждение вредит или помогает вам, вы сможете принять взвешенное решение о выработке более здоровой системы убеждений."
        }
        leftColumnTitle="Преимущества убеждения"
        leftColumnPlaceholder="Запишите преимущества следования этому убеждению..."
        rightColumnTitle="Недостатки убеждения"
        rightColumnPlaceholder="Запишите недостатки следования этому убеждению..."
        showCognitiveDistortions={false}
        showMiddleColumn={false}
        methodId={SHEET_ID}
        onSave={handleSave}
        actionButtons={actionButtons}
        saveButtonDisabled={!belief.trim()}
        saveButtonTooltip={!belief.trim() ? 'Пожалуйста, введите убеждение для анализа' : undefined}
      />
    </div>
  );
};

export default AdvantagesDisadvantages;
