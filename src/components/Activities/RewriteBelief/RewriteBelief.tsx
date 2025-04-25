// src/components/Activities/RewriteBelief/RewriteBelief.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { SpecialContent } from '../../../types/progress.types';
import styles from './RewriteBelief.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';

// Добавьте новый ID в constants/activities.ts
// REWRITE_BELIEF: 'rewrite_belief'
const SHEET_ID: SpecialContent = ACTIVITY_IDS.REWRITE_BELIEF;

const RewriteBelief: React.FC = () => {
  const dispatch = useAppDispatch();
  const [oldBelief, setOldBelief] = useState<string>('');
  const [newBelief, setNewBelief] = useState<string>('');

  const actionButtons = (
    <div className={styles.actionButtons}>
      <ChapterLinkButton activityId={SHEET_ID} />
      <FavoriteButton activityId={SHEET_ID} />
    </div>
  );

  const handleSave = () => {
    // Создаем уникальный ID для упражнения
    const exerciseId = `rewrite_belief_${Date.now()}`;
    
    // Определите структуру упражнения в соответствии с RewriteBeliefExercise
    const exercise = {
      ...createBaseExercise(SHEET_ID, exerciseId),
      belief: oldBelief,
      newBelief: newBelief,
      advantages: [],
      disadvantages: [],
      timestamp: getCurrentISOTimestamp()
    };

    dispatch(addExercise({ 
      exercise, 
      showNotification: true 
    }));
    
    // Очистка полей после сохранения
    setOldBelief('');
    setNewBelief('');
  };

  const isFormValid = oldBelief.trim() && newBelief.trim();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Перепишите убеждение</h2>
        <div>{actionButtons}</div>
      </div>

      <p className={styles.description}>
        После анализа преимуществ и недостатков, если вы увидели, что страх неодобрения причиняет вам больше вреда, чем пользы, 
        следующий шаг — переписать скрытое убеждение таким образом, чтобы оно звучало более реалистично и жизнеутверждающе.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="oldBelief">Ваше нынешнее убеждение:</label>
        <textarea
          id="oldBelief"
          value={oldBelief}
          onChange={(e) => setOldBelief(e.target.value)}
          placeholder="Например: «Я всегда должна делать то, чего от меня ожидают»"
          className={styles.textArea}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="newBelief">Новое, более реалистичное убеждение:</label>
        <textarea
          id="newBelief"
          value={newBelief}
          onChange={(e) => setNewBelief(e.target.value)}
          placeholder="Например: «Получать одобрение других людей может быть приятно, но мне не нужно одобрение, чтобы чувствовать себя ценным человеком»"
          className={styles.textArea}
          rows={6}
        />
      </div>

      <button 
        className={styles.saveButton} 
        onClick={handleSave}
        disabled={!isFormValid}
      >
        Сохранить
      </button>
    </div>
  );
};

export default RewriteBelief;
