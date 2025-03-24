import { useState } from 'react';
import styles from './ListOfCognitiveBiases.module.css';
import { cognitiveBiases } from './cognitiveBiases';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import { ACTIVITY_IDS } from '../../../constants/activities';
import FavoriteButton from '../../shared/FavoriteButton';
const SHEET_ID = ACTIVITY_IDS.COGNITIVE_BIASES;

const ListOfCognitiveBiases: React.FC = () => {
  const [openBiasIndex, setOpenBiasIndex] = useState<number | null>(null);

  const handleBiasClick = (index: number) => {
    setOpenBiasIndex(openBiasIndex === index ? null : index);
  };

  return (
    <div className={styles.listOfCognitiveBiases}>
      <div className={styles.titleContainer}>
        <h2>Список когнитивных искажений</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
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
