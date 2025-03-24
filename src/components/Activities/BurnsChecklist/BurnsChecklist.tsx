import { useProgress } from "../../../store/ProgressContext";
import Survey from "../Survey";
import { burnsConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';
import FavoriteButton from '../../shared/FavoriteButton';

// TODO - перепроверить добавление в избранное в других браузерах
// TODO - добавить кнопку с октрытием главы

const SHEET_ID = ACTIVITY_IDS.BURNS_CHECKLIST;

const BurnsChecklist: React.FC = () => {
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
      <ChapterLinkButton activityId={SHEET_ID} className={styles.chapterButton} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  return <Survey config={burnsConfig} onComplete={handleTestComplete} actionButtons={ActionButtons} />;
};

export default BurnsChecklist; 
