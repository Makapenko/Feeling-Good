import { useProgress } from "../../../store/ProgressContext";
import Survey from "../Survey";
import { novacoConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.NOVACO_SCALE;

const NovacoScale: React.FC = () => {
  const { dispatch } = useProgress();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  // Создаем компонент с кнопками действий
  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  return <Survey config={novacoConfig} onComplete={handleTestComplete} actionButtons={ActionButtons} />;
};

export default NovacoScale; 
