import { useProgress } from "../../../store/ProgressContext";
import Survey from "../Survey";
import { burnsConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";

// TODO - перепроверить добавление в избранное в других браузерах

const BurnsChecklist: React.FC = () => {
  const { dispatch } = useProgress();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  return <Survey config={burnsConfig} onComplete={handleTestComplete} />;
};

export default BurnsChecklist; 
