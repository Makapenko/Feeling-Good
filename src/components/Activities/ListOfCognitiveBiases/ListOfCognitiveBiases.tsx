import { useState } from 'react';
import styles from './ListOfCognitiveBiases.module.css';
import { cognitiveBiases } from './cognitiveBiases';

const ListOfCognitiveBiases = () => {
  const [openBiasIndex, setOpenBiasIndex] = useState<number | null>(null);

  const handleBiasClick = (index: number) => {
    setOpenBiasIndex(openBiasIndex === index ? null : index);
  };

  return (
    <div className={styles.listOfCognitiveBiases}>
      <h2>Определение когнитивных искажений</h2>
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
