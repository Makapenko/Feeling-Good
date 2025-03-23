import React, { useMemo } from 'react';
import styles from './DisarmingTechnique.module.css';
import { useProgress } from '../../../store/ProgressContext';

const DisarmingTechnique: React.FC = () => {

  const SHEET_ID = 'disarming-technique';
  const { progress, dispatch } = useProgress();
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
        <h2>Техника обезоруживания</h2>
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          ★
        </button>
      </div>

      <div className={styles.description}>
        <h3>О методе</h3>
        <p>
          Техника обезоруживания — это эффективный метод, который помогает справиться
          с ситуациями, когда вы чувствуете давление или принуждение со стороны других людей.
          Суть метода заключается в том, чтобы согласиться с собеседником, сохраняя при этом
          свою автономность и чувство собственного достоинства.
        </p>

        <div className={styles.section}>
          <h4>Почему это работает?</h4>
          <p>
            Когда мы чувствуем давление, наша естественная реакция — сопротивляться.
            Это один из основных законов психологии: на каждое действие есть противодействие.
            Чем сильнее на нас давят, тем сильнее мы сопротивляемся, даже если
            предложение разумно и полезно для нас.
          </p>
        </div>

        <div className={styles.section}>
          <h4>Как это работает?</h4>
          <p>
            Вместо того чтобы сопротивляться или подчиняться, вы соглашаетесь с
            собеседником, но делаете акцент на том, что это ваше собственное решение.
            Таким образом вы:
          </p>
          <ul>
            <li>Избегаете ненужного конфликта</li>
            <li>Сохраняете контроль над ситуацией</li>
            <li>Подчеркиваете свою автономность</li>
            <li>Уважаете как свою позицию, так и позицию собеседника</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Ключевые принципы</h4>
          <ul>
            <li>Признайте правоту собеседника там, где вы с ним согласны</li>
            <li>Подчеркните, что это ваше собственное решение</li>
            <li>Сохраняйте спокойный и уверенный тон</li>
            <li>Избегайте оправданий и защитных реакций</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Преимущества метода</h4>
          <ul>
            <li>Снижает эмоциональное напряжение в отношениях</li>
            <li>Помогает сохранить самоуважение</li>
            <li>Позволяет действовать в своих интересах без чувства принуждения</li>
            <li>Улучшает коммуникацию с близкими людьми</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisarmingTechnique; 
