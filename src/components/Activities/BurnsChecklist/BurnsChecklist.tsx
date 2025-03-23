import { useProgress } from "../../../store/ProgressContext";
import Survey from "../Survey";
import { burnsConfig } from "../Survey/configs";
import { SurveyResult } from "../Survey/types";
import { useMemo } from 'react';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import styles from '../Survey/Survey.module.css';

// TODO - перепроверить добавление в избранное в других браузерах
// TODO - добавить кнопку с октрытием главы

const SHEET_ID = ACTIVITY_IDS.BURNS_CHECKLIST;

const BurnsChecklist: React.FC = () => {
  const { dispatch, progress } = useProgress();

  const handleTestComplete = (result: SurveyResult) => {
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  // Получаем статус избранного из Redux
  const isFavorite = useMemo(() => {
    return progress.favoriteActivities?.includes(SHEET_ID) || false;
  }, [progress.favoriteActivities]);

  // Добавление или удаление из избранного через Redux
  const toggleFavorite = () => {
    dispatch({
      type: 'TOGGLE_FAVORITE_ACTIVITY',
      activityId: SHEET_ID
    });
  };

  // Создаем компонент с кнопками действий
  const ActionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} className={styles.chapterButton} />
      <button
        className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      >
        ★
      </button>
    </div>
  );

  return <Survey config={burnsConfig} onComplete={handleTestComplete} actionButtons={ActionButtons} />;
};

export default BurnsChecklist; 
