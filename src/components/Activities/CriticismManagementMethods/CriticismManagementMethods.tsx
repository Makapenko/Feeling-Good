import { useState, useRef, useEffect } from 'react';
import styles from './CriticismManagementMethods.module.css';
import { criticismMethods } from './criticismMethods';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import { ACTIVITY_IDS } from '../../../constants/activities';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.CRITICISM_MANAGEMENT_METHODS;

const CriticismManagementMethods: React.FC = () => {
  const [openMethodIndex, setOpenMethodIndex] = useState<number | null>(null);
  const methodRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMethodClick = (index: number) => {
    const newIndex = openMethodIndex === index ? null : index;
    setOpenMethodIndex(newIndex);
    
    if (newIndex !== null) {
      // Добавляем небольшую задержку, чтобы дать время для рендеринга
      setTimeout(() => {
        const currentRef = methodRefs.current[newIndex];
        if (currentRef) {
          currentRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Инициализация массива рефов
  useEffect(() => {
    methodRefs.current = methodRefs.current.slice(0, criticismMethods.length);
  }, []);

  return (
    <div className={styles.criticismManagementMethods}>
      <div className={styles.titleContainer}>
        <h2>Методы управления критикой</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>
      <div>
        {criticismMethods.map((method, index) => (
          <div key={index}>
            <div
              ref={el => {
                methodRefs.current[index] = el;
              }}
              className={`${styles.methodHeader} ${openMethodIndex === index ? styles.open : ''}`}
              onClick={() => handleMethodClick(index)}
            >
              <div className={styles.headerContent}>
                <b>{method.title}</b>
                <span>{method.shortDescription}</span>
              </div>
              <div className={styles.arrow}>▼</div>
            </div>
            {openMethodIndex === index && (
              <div className={styles.methodDescription}>
                {method.description.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticismManagementMethods; 
