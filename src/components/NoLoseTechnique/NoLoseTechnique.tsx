import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';

export const NoLoseTechnique: React.FC = () => {
  return (
    <ThreeColumnsBase
      title="Беспроигрышная техника"
      description="Составьте список негативных последствий, с которыми вы можете столкнуться, если пойдете на риск и действительно проиграете. Затем сконцентрируйтесь на искажениях, лежащих в основе ваших страхов, и покажите, как вы можете эффективно справиться с ними, даже если вас постигнет разочарование."
      leftColumnTitle="Негативные последствия"
      leftColumnPlaceholder="Запишите возможные негативные последствия, если вы рискнете и потерпите неудачу..."
      rightColumnTitle="Позитивные мысли и стратегии"
      rightColumnPlaceholder="Как вы можете эффективно справиться с этими последствиями, даже если потерпите неудачу..."
      showCognitiveDistortions={true}
    />
  );
}; 
