import React, { useMemo } from 'react';
import styles from './SelfActivationMethods.module.css';
import { selfActivationMethods } from '../../../data/selfActivationMethods';
import { useProgress, SpecialContent } from '../../../store/ProgressContext';
import { ProgressAction } from '../../../store/progressReducer';

//TODO - не работает добавление в избранное
const SHEET_ID = 'self-activation';

const SelfActivationMethods: React.FC = () => {
  const { progress, dispatch } = useProgress();

  const handleTechniqueClick = (technique: string) => {
    let content: SpecialContent | undefined = undefined;

    switch (technique) {
      case 'Метод маленьких шагов':
        content = 'small-steps';
        break;
      case 'Ежедневное расписание дня':
        content = 'daily-schedule';
        break;
      case 'Листок антипрокрастинации':
        content = 'anti-procrastination';
        break;
      case 'Ежедневная запись автоматических мыслей':
        content = 'thought-diary';
        break;
      case 'Листок предполагаемого удовольствия':
        content = 'pleasure-sheet';
        break;
      case 'Никаких но':
        content = 'no-buts';
        break;
      case 'Техника мешающих и помогающих мыслей':
        content = 'hindering-helping-thoughts';
        break;
      case 'Мотивация без принуждения':
        content = 'motivation-without-coercion';
        break;
      case 'Представьте успех':
        content = 'imagine-success'
        break;
      case 'Считайте свои достижения':
        content = 'count-achievements'
        break;
      case 'Проверьте свои «не могу»':
        content = 'check-cant-do'
        break;
      case 'Беспроигрышная техника':
        content = 'no-lose-technique';
        break;
      case 'Техника обезоруживания':
        content = 'disarming-technique';
        break;
    }

    dispatch({
      type: 'SET_SPECIAL_CONTENT',
      content
    } as ProgressAction);
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
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Обзор методов самоактивации</h2>
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          ★
        </button>
      </div>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.cell}>Симптомы</div>
          <div className={styles.cell}>Техника</div>
          <div className={styles.cell}>Суть метода</div>
        </div>
        {selfActivationMethods.map((method, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.cell}>{method.symptom}</div>
            <div className={styles.cell}>
              {method.hasComponent ? (
                <button
                  className={styles.techniqueButton}
                  onClick={() => handleTechniqueClick(method.technique)}
                >
                  {method.technique}
                </button>
              ) : (
                method.technique
              )}
            </div>
            <div className={styles.cell}>{method.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfActivationMethods; 
