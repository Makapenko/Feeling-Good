import React from 'react';
import styles from './SelfActivationMethods.module.css';
import { selfActivationMethods } from '../../../data/selfActivationMethods';
import { useProgress, SpecialContent } from '../../../store/ProgressContext';
import { ProgressAction } from '../../../store/progressReducer';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';

const SHEET_ID = ACTIVITY_IDS.SELF_ACTIVATION;


const SelfActivationMethods: React.FC = () => {
  const { dispatch } = useProgress();

  const handleTechniqueClick = (technique: string) => {
    let content: SpecialContent | undefined = undefined;

    switch (technique) {
      case 'Метод маленьких шагов':
        content = ACTIVITY_IDS.SMALL_STEPS;
        break;
      case 'Ежедневное расписание дня':
        content = ACTIVITY_IDS.DAILY_SCHEDULE;
        break;
      case 'Листок антипрокрастинации':
        content = ACTIVITY_IDS.ANTI_PROCRASTINATION;
        break;
      case 'Ежедневная запись автоматических мыслей':
        content = ACTIVITY_IDS.THOUGHT_DIARY;
        break;
      case 'Листок предполагаемого удовольствия':
        content = ACTIVITY_IDS.PLEASURE_SHEET;
        break;
      case 'Никаких но':
        content = ACTIVITY_IDS.NO_BUTS;
        break;
      case 'Техника мешающих и помогающих мыслей':
        content = ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS;
        break;
      case 'Мотивация без принуждения':
        content = ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION;
        break;
      case 'Представьте успех':
        content = ACTIVITY_IDS.IMAGINE_SUCCESS;
        break;
      case 'Считайте свои достижения':
        content = ACTIVITY_IDS.COUNT_ACHIEVEMENTS;
        break;
      case 'Проверьте свои «не могу»':
        content = ACTIVITY_IDS.CHECK_CANT_DO;
        break;
      case 'Беспроигрышная техника':
        content = ACTIVITY_IDS.NO_LOSE_TECHNIQUE;
        break;
      case 'Техника обезоруживания':
        content = ACTIVITY_IDS.DISARMING_TECHNIQUE;
        break;
    }

    dispatch({
      type: 'SET_SPECIAL_CONTENT',
      content
    } as ProgressAction);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Обзор методов самоактивации</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} className={styles.chapterButton} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
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
