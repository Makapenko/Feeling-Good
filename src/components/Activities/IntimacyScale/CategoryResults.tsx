import React from 'react';
import { IntimacyCategoryResult } from './types';
import { INTIMACY_CATEGORY_DESCRIPTIONS } from './intimacyConfig';
import styles from '../DysfunctionalAttitudeScale/DysfunctionalAttitudeScale.module.css';

interface CategoryResultsProps {
  categoryResults: IntimacyCategoryResult[];
}

const CategoryResults: React.FC<CategoryResultsProps> = ({ categoryResults }) => {
  return (
    <div className={styles.categoryResults}>
      <h3>Результаты по установкам</h3>

      {categoryResults.map(result => {
        const categoryDesc = INTIMACY_CATEGORY_DESCRIPTIONS.find(
          desc => desc.category === result.category
        );
        if (!categoryDesc) return null;

        const isHigh = result.score >= 6; // >= 50% от максимума

        return (
          <div
            key={result.category}
            className={`${styles.categoryResult} ${isHigh ? styles.weakness : styles.strength}`}
          >
            <div className={styles.categoryTitle}>
              <h4>{categoryDesc.title}</h4>
              <span className={`${styles.categoryScore} ${isHigh ? styles.negative : styles.positive}`}>
                {result.score} / {result.maxScore}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryResults;
