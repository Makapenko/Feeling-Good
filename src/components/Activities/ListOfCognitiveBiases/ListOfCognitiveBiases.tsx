import { useState, useRef, useEffect } from 'react';
import styles from './ListOfCognitiveBiases.module.css';
import { cognitiveBiases } from './cognitiveBiases';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import { ACTIVITY_IDS } from '../../../constants/activities';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.COGNITIVE_BIASES;

const ListOfCognitiveBiases: React.FC = () => {
  const [openBiasIndex, setOpenBiasIndex] = useState<number | null>(null);
  const biasRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleBiasClick = (index: number) => {
    const newIndex = openBiasIndex === index ? null : index;
    setOpenBiasIndex(newIndex);
    
    if (newIndex !== null) {
      // Добавляем небольшую задержку, чтобы дать время для рендеринга
      setTimeout(() => {
        const currentRef = biasRefs.current[newIndex];
        if (currentRef) {
          currentRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Инициализация массива рефов
  useEffect(() => {
    biasRefs.current = biasRefs.current.slice(0, cognitiveBiases.length);
  }, []);

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
              ref={el => {
                biasRefs.current[index] = el;
              }}
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
