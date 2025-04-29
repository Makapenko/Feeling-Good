import styles from '../Survey/Survey.module.css';
import { useAppDispatch } from "../../../redux/hooks";
import { saveTestResultWithNotification } from "../../../redux/actions";
import Survey from "../Survey/Survey";
import { novacoConfig } from "./novacoConfig";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.NOVACO_SCALE;

const NovacoScale: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch(saveTestResultWithNotification({
      testResult: result,
      showNotification: false
    }));
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
