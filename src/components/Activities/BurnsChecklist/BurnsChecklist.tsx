import { useAppDispatch } from "../../../redux/hooks";
import { saveTestResult } from "../../../redux/slices/progressSlice";
import Survey from "../Survey";
import { burnsConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.BURNS_CHECKLIST;

const BurnsChecklist: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch(saveTestResult(result));
  };

  // Создаем компонент с кнопками действий
  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  return <Survey config={burnsConfig} onComplete={handleTestComplete} actionButtons={ActionButtons} />;
};

export default BurnsChecklist; 
