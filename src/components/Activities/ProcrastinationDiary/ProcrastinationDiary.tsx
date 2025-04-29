import React from 'react';
import ThoughtDiaryBase from '../ThoughtDiaryBase/ThoughtDiaryBase';
import { ACTIVITY_IDS } from '../../../constants/activities';

const ProcrastinationDiary: React.FC = () => {
  const description = "Записывайте ситуации, когда вы откладываете важные дела. Фиксируйте свои эмоции (без оценки интенсивности), мысли и рациональные ответы на них.";
  
  return (
    <ThoughtDiaryBase
      activityId={ACTIVITY_IDS.PROCRASTINATION_DIARY}
      title="Дневник прокрастинации"
      description={description}
      emotionsLabel="Эмоции при откладывании дела"
      emotionsTooltip="Опишите, какие эмоции вы испытываете, когда откладываете важное дело"
      resultLabel="Эмоции после работы с дневником"
      resultTooltip="Какие эмоции вы испытываете после анализа ситуации?"
      showEmotionIntensity={false}
      showResultIntensity={false}
      showCognitiveDistortions={false}
    />
  );
};

export default ProcrastinationDiary; 
