import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';
import { ThreeColumnsExercise } from '../../../types/progress.types';

const ThreeColumnsMethod: React.FC = () => {
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
      title="Метод трёх колонок"
      description="Запишите свои автоматические мысли и найдите им более рациональную альтернативу"
      leftColumnTitle="Автоматическая мысль"
      leftColumnPlaceholder="Запишите вашу негативную мысль... (самокритика)"
      rightColumnTitle="Рациональный ответ"
      rightColumnPlaceholder="Запишите более объективную мысль... (самозащита)"
      showCognitiveDistortions={true}
      methodId="three-columns-method"
      onSave={handleSave}
    />
  );
}; 

export default ThreeColumnsMethod
