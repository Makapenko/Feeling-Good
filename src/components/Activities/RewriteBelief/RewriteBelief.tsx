import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { SpecialContent } from '../../../types/progress.types';
import styles from './RewriteBelief.module.css';
import { ACTIVITY_IDS } from '../../../constants/activities';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { addExercise } from '../../../redux/actions';
import { createBaseExercise } from '../../../utils/exerciseUtils';
import { getCurrentISOTimestamp } from '../../../utils/dateUtils';

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
    const exercise = {
      ...createBaseExercise(SHEET_ID, `rewrite_belief_${Date.now()}`),
      belief: oldBelief,
      newBelief,
      advantages: [],
      disadvantages: [],
      timestamp: getCurrentISOTimestamp()
    };

    dispatch(addExercise({ exercise, showNotification: true }));
    setOldBelief('');
    setNewBelief('');
  };

  const isFormValid = oldBelief.trim() && newBelief.trim();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Перепишите убеждение</h2>
        {actionButtons}
      </div>

      <p className={styles.description}>
        После анализа преимуществ и недостатков, если вы увидели, что страх неодобрения причиняет вам больше вреда, чем пользы,
        следующий шаг — переписать скрытое убеждение таким образом, чтобы оно звучало более реалистично и жизнеутверждающе.
      </p>

      <details className={styles.examples}>
        <summary className={styles.examplesSummary}>Примеры переписанных убеждений</summary>
        <ol className={styles.examplesList}>
          <li>Помните: когда кто-либо негативно на вас реагирует, причина может крыться в нерациональности его или ее мышления.</li>
          <li>Если критика оправданна, она не будет действовать разрушительно. Она помогает точнее определить ошибку и предпринять шаги по ее исправлению. На своих ошибках можно многому научиться, не стоит их стыдиться. Человеку просто положено время от времени совершать ошибки.</li>
          <li>Если человек допустил промах, это не значит, что он НЕУДАЧНИК ПО ЖИЗНИ. Невозможно ошибаться постоянно или даже бóльшую часть времени. Подумайте о тысячах вещей, которые вы делаете правильно. Более того, всегда можно учиться и совершенствоваться.</li>
          <li>Другие люди не могут судить о вашей человеческой ценности, только о правильности и достоинствах ваших слов или поступков.</li>
          <li>Все люди будут оценивать вас по-разному, вне зависимости от того, насколько хорошо или плохо вы поступаете. Неодобрение не распространяется с огромной скоростью, а один случай отвержения не приведет к бесконечной серии отвержений. Так что, даже если случится худшее и вас кто-то отвергнет, вы не окажетесь в полной изоляции.</li>
          <li>Неодобрение и критика обычно причиняют неудобство, но дискомфорт пройдет. Хватит предаваться унынию. Займитесь тем, что раньше приносило удовольствие, даже если чувствуете, что начинать совершенно бессмысленно.</li>
          <li>Критика и неодобрение могут расстроить вас только в той мере, в какой вы «ведетесь» на обвинения в свой адрес.</li>
          <li>Неодобрение — это не навсегда. Из него не следует, что ваши отношения с человеком, который вас не одобряет, обязательно закончатся только потому, что он вас покритиковал. Споры — это часть жизни, и в большинстве случаев вполне возможно через некоторое время прийти к взаимопониманию.</li>
          <li>Если вы сами критикуете другого человека, это не делает его плохим по своей сути. Зачем давать другому право и власть судить вас? Все мы просто люди, а не члены Верховного суда. Не раздувайте значимость других людей сверх всякой меры.</li>
        </ol>
      </details>

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
