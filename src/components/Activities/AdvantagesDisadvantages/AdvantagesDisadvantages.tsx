import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useAppDispatch } from '../../../redux/hooks';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';
import styles from '../ThreeColumnsBase/ThreeColumnsBase.module.css';
import { ACTIVITY_IDS, ACTIVITY_NAMES } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';

const SHEET_ID = ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES;

const AdvantagesDisadvantages: React.FC = () => {
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

  const description = 
    "Анализ преимуществ и недостатков — первый шаг на пути к изменению дисфункциональных убеждений.\n\n" +
    "Инструкция к применению:\n" +
    "1. Выберите одно из ваших дисфункциональных убеждений, которое вы хотели бы изменить (например, «Я всегда должна делать то, чего от меня ожидают»)\n" +
    "2. В левой колонке запишите все преимущества и выгоды, которые даёт вам это убеждение\n" +
    "3. В правой колонке запишите все недостатки и проблемы, которые создаёт для вас это убеждение\n" +
    "4. Сравните обе колонки и примите решение, хотите ли вы изменить данное убеждение\n\n" +
    "После заполнения таблицы вы сможете переписать убеждение в более реалистичной и здоровой форме.";

  return (
    <ThreeColumnsBase 
      title={ACTIVITY_NAMES[ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES]}
      description={description}
      leftColumnTitle="Преимущества убеждения"
      leftColumnPlaceholder="Запишите, какие выгоды и преимущества вам даёт ваше убеждение (например, «Люди считают меня надёжным и ответственным», «Чувствую себя в безопасности»)..."
      rightColumnTitle="Недостатки убеждения"
      rightColumnPlaceholder="Запишите, какие проблемы и недостатки создаёт ваше убеждение (например, «Не могу отказать, даже когда это вредит моим интересам», «Чувствую себя перегруженной»)..."
      showCognitiveDistortions={false}
      methodId={SHEET_ID}
      onSave={handleSave}
      actionButtons={actionButtons}
    />
  );
};

export default AdvantagesDisadvantages; 
