import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';

export const HinderingHelpingThoughts: React.FC = () => {
  return (
    <ThreeColumnsBase
      title="Техника мешающих и помогающих мыслей"
      description="Замените мешающие мысли на помогающие, чтобы улучшить свою мотивацию и продуктивность"
      leftColumnTitle="Мешающая мысль"
      leftColumnPlaceholder="Запишите мысль, которая мешает вам действовать..."
      rightColumnTitle="Помогающая мысль"
      rightColumnPlaceholder="Замените её на более конструктивную мысль..."
      showCognitiveDistortions={true}
    />
  );
}; 
