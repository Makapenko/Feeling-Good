import React from 'react';
import { ThreeColumnsBase } from '../ThreeColumnsBase/ThreeColumnsBase';
import { useProgress } from '../../../store/ProgressContext';
import { NoLoseTechniqueExercise } from '../../../types/progress.types';
import { ThreeColumnsMethodResult } from '../ThreeColumnsBase/types';

const SHEET_ID = 'no-lose-technique';

const NoLoseTechnique: React.FC = () => {
  const { dispatch } = useProgress();

  const handleSave = (result: ThreeColumnsMethodResult) => {
    const exercise: NoLoseTechniqueExercise = {
      type: 'no-lose-technique',
      id: SHEET_ID,
      name: 'Беспроигрышная техника',
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
      title="Беспроигрышная техника"
      description="Составьте список негативных последствий, с которыми вы можете столкнуться, если пойдете на риск и действительно проиграете. Затем сконцентрируйтесь на искажениях, лежащих в основе ваших страхов, и покажите, как вы можете эффективно справиться с ними, даже если вас постигнет разочарование."
      leftColumnTitle="Негативные последствия"
      leftColumnPlaceholder="Запишите возможные негативные последствия, если вы рискнете и потерпите неудачу..."
      rightColumnTitle="Позитивные мысли и стратегии"
      rightColumnPlaceholder="Как вы можете эффективно справиться с этими последствиями, даже если потерпите неудачу..."
      showCognitiveDistortions={true}
      methodId={SHEET_ID}
      onSave={handleSave}
    />
  );
};

export default NoLoseTechnique;
