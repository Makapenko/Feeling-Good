import { useProgress } from "../../../store/ProgressContext";
import Survey from "../Survey";
import { novacoConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";

const NovacoScale: React.FC = () => {
  const { dispatch } = useProgress();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  return <Survey config={novacoConfig} onComplete={handleTestComplete} />;
};

export default NovacoScale; 
