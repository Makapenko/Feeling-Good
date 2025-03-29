import React from 'react';
import { DASCategoryResult } from './DysfunctionalAttitudeTypes';
import { CATEGORY_DESCRIPTIONS } from './dasConfig';
import styles from './DysfunctionalAttitudeScale.module.css';

interface CategoryResultsProps {
  categoryResults: DASCategoryResult[];
}

const CategoryResults: React.FC<CategoryResultsProps> = ({ categoryResults }) => {
  // Функция для получения подходящего описания в зависимости от значения
  const getCategoryDescription = (category: string, score: number) => {
    const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === category);
    if (!categoryDesc) return '';
    
    // Если значение >= 0, используем позитивное описание, иначе негативное
    return score >= 0 
      ? categoryDesc.positiveDescription 
      : categoryDesc.negativeDescription;
  };

  return (
    <div className={styles.categoryResults}>
      <h3>Интерпретация результатов по категориям</h3>
      
      {categoryResults.map(result => {
        const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === result.category);
        if (!categoryDesc) return null;
        
        // Определяем, какое описание использовать
        const description = getCategoryDescription(result.category, result.score);
        
        return (
          <div
            key={result.category}
            className={`${styles.categoryResult} ${result.isStrength ? styles.strength : styles.weakness}`}
          >
            <div className={styles.categoryTitle}>
              <h4>{categoryDesc.title}</h4>
              <span className={`${styles.categoryScore} ${result.score >= 0 ? styles.positive : styles.negative}`}>
                {result.score > 0 ? '+' : ''}{result.score}
              </span>
            </div>
            <p className={styles.categoryDescription}>
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryResults; 
