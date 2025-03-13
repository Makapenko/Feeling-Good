import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';

const HinderingHelpingThoughts: React.FC = () => {
  const { dispatch } = useProgress();

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: ThreeColumnsExercise = {
      type: 'three-columns-method',
      id: result.id,
      name: result.name,
      completed: result.completed,
      completedAt: result.completedAt,
      records: result.records
    };

    dispatch({
      type: 'SAVE_EXERCISE',
      exercise
    });
  };

  return (
    <ThreeColumnsBase
      title="Техника мешающих и помогающих мыслей"
      description="Замените мешающие мысли на помогающие, чтобы улучшить свою мотивацию и продуктивность"
      leftColumnTitle="Мешающая мысль"
      leftColumnPlaceholder="Запишите мысль, которая мешает вам действовать..."
      rightColumnTitle="Помогающая мысль"
      rightColumnPlaceholder="Замените её на более конструктивную мысль..."
      showCognitiveDistortions={true}
      methodId="hindering-helping-thoughts"
      onSave={handleSave}
    />
  );
};

export default HinderingHelpingThoughts;
