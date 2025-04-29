import React from 'react';
import ThoughtDiaryBase from '../ThoughtDiaryBase/ThoughtDiaryBase';
import { ACTIVITY_IDS } from '../../../constants/activities';

const ThoughtDiary: React.FC = () => {
  const description = "Когда вы испытываете неприятную ситуацию, которая предположительно вызывала эти эмоции. Затем запишите автоматическую мысль, связанную с эмоцией. Оценивая степень эмоции, представьте, что 1% - это едва различимая эмоция, а 100% - самая сильная из возможных.";
  
  return (
    <ThoughtDiaryBase
      activityId={ACTIVITY_IDS.THOUGHT_DIARY}
      title="Дневник автоматических мыслей"
      description={description}
      emotionsLabel="Эмоции"
      emotionsTooltip="1. Определите характер эмоции: грусть, волнение, злость и т.д. 2. Оцените интенсивность эмоции от 1 до 100%"
      resultLabel="Результат"
      resultTooltip="Определите ваши эмоции и их интенсивность после проведенной работы от 0 до 100%"
      showEmotionIntensity={true}
      showResultIntensity={true}
      showCognitiveDistortions={true}
    />
  );
};

export default ThoughtDiary; 
