import React from 'react';
import ThoughtDiaryBase from '../ThoughtDiaryBase/ThoughtDiaryBase';
import { ACTIVITY_IDS } from '../../../constants/activities';

const ImageryScenesDiary: React.FC = () => {
  const description = "Негативные «горячие» мысли, которые крутятся у вас в голове, когда вы сердитесь, представляют собой сценарий вашего личного фильма. Запишите ситуацию, вызвавшую гнев, и «горячие» образы, возникающие в голове. Затем преобразуйте их в «прохладные» мысли, используя юмор или другие техники.";
  
  return (
    <ThoughtDiaryBase
      activityId={ACTIVITY_IDS.IMAGERY_SCENES_DIARY}
      title="Дневник воображаемых сцен"
      description={description}
      emotionsLabel="Эмоции"
      emotionsTooltip="Определите характер эмоции: злость, ненависть, отчаяние и т.д. Оцените интенсивность эмоции от 1 до 100%"
      resultLabel="Результат"
      resultTooltip="Запишите, как изменились ваши эмоции после преобразования «горячих» мыслей в «прохладные»"
      showEmotionIntensity={true}
      showResultIntensity={true}
      showCognitiveDistortions={false}
    />
  );
};

export default ImageryScenesDiary; 
