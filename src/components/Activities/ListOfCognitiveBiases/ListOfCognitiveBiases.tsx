import { useMemo, useState } from 'react';
import styles from './ListOfCognitiveBiases.module.css';
import { cognitiveBiases } from './cognitiveBiases';
import { useProgress } from '../../../store/ProgressContext';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import { ACTIVITY_IDS } from '../../../constants/activities';

const SHEET_ID = ACTIVITY_IDS.COGNITIVE_BIASES;

const ListOfCognitiveBiases: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const [openBiasIndex, setOpenBiasIndex] = useState<number | null>(null);

  const handleBiasClick = (index: number) => {
    setOpenBiasIndex(openBiasIndex === index ? null : index);
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

  return (
    <div className={styles.listOfCognitiveBiases}>
      <div className={styles.titleContainer}>
        <h2>Список когнитивных искажений</h2>
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
      </div>
      <ol>
        {cognitiveBiases.map((bias, index) => (
          <li key={index}>
            <div
              className={`${styles.biasHeader} ${openBiasIndex === index ? styles.open : ''}`}
              onClick={() => handleBiasClick(index)}
            >
              <div className={styles.headerContent}>
                <b>{bias.title}</b>
                <span>{bias.shortDescription}</span>
              </div>
              <div className={styles.arrow}>▼</div>
            </div>
            {openBiasIndex === index && (
              <div className={styles.biasDescription}>
                {bias.description.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ListOfCognitiveBiases;
