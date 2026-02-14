import React from 'react';
import styles from './SelfWorthMemo.module.css';
import ChapterLinkButton from '../../shared/ChapterLinkButton';
import FavoriteButton from '../../shared/FavoriteButton';
import { ACTIVITY_IDS } from '../../../constants/activities';

const SHEET_ID = ACTIVITY_IDS.SELF_WORTH_MEMO;

const SelfWorthMemo: React.FC = () => {

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Как завоевать расположение людей</h2>
        <div className={styles.actionButtons}>
          <ChapterLinkButton activityId={SHEET_ID} />
          <FavoriteButton activityId={SHEET_ID} />
        </div>
      </div>

      <div className={styles.description}>
        <h3>Памятка</h3>
        <p>
          Три простых шага, которые помогут вам наладить контакт с окружающими
          и перестать бояться отвержения.
        </p>

        <div className={styles.section}>
          <h4>Шаг 1. Повышайте самооценку</h4>
          <p>
            Не стоит недооценивать себя, считая, что вы хуже других. Перестаньте
            к себе придираться. Повышайте самооценку с помощью техник, описанных
            в главе 4. Если вы любите себя, люди будут реагировать на чувство
            радости, которое вы излучаете, и захотят быть рядом с вами.
          </p>
        </div>

        <div className={styles.section}>
          <h4>Шаг 2. Делайте искренние комплименты</h4>
          <p>
            Вместо того чтобы нервно пытаться выяснить, нравитесь ли вы человеку
            или он вас отвергает, сперва позвольте ему понравиться себе и сообщите
            ему об этом.
          </p>
        </div>

        <div className={styles.section}>
          <h4>Шаг 3. Проявляйте интерес к окружающим</h4>
          <p>
            Продемонстрируйте свой интерес к окружающим, узнавая о том, что их
            увлекает. Попросите рассказать о том, что их больше всего волнует,
            и с воодушевлением реагируйте на их слова.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfWorthMemo;
