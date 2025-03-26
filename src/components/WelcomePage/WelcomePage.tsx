import styles from './WelcomePage.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { unlockAllContent } from '../../redux/slices/progressSlice';

const WelcomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const unlockedContent = useAppSelector(state => state.progress.unlockedContent);
  const isAllContentUnlocked = unlockedContent?.chapters?.includes('all');

  const handleUnlockContent = () => {
    if (!isAllContentUnlocked) {
      dispatch(unlockAllContent());
    }
  };

  return (
    <div className={styles.welcomePage}>
      <h1>Терапия настроения</h1>
      
      <div className={styles.content}>
        <p>
          Интерактивная версия книги Дэвида Бернса <i>"Терапия настроения"</i> - практическое руководство 
          по когнитивно-поведенческой терапии.
        </p>

        <h2>Как это работает?</h2>
        <ul>
          <li>Читайте главы книги в удобном темпе</li>
          <li>Выполняйте практические упражнения</li>
          <li>Отслеживайте прогресс в календаре</li>
          <li>Все данные хранятся локально</li>
        </ul>

        <div className={styles.notice}>
          <h3>Важно:</h3>
          <p>
            Все ваши записи хранятся только в браузере. При очистке данных браузера 
            записи могут быть удалены.
          </p>
        </div>

        <div className={styles.disclaimer}>
          <p>
            Проект в разработке. Регулярные обновления.
          </p>
          <button 
            className={`${styles.unlockButton} ${isAllContentUnlocked ? styles.unlocked : ''}`}
            onClick={handleUnlockContent}
            disabled={isAllContentUnlocked}
          >
            {isAllContentUnlocked ? 'Контент разблокирован' : 'Разблокировать контент'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 
