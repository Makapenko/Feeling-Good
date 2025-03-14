import { useProgress } from '../../store/ProgressContext';
import styles from './WelcomePage.module.css';

const WelcomePage: React.FC = () => {
  const { dispatch } = useProgress();

  const handleUnlockContent = () => {
    dispatch({ type: 'UNLOCK_ALL_CONTENT' });
  };

  return (
    <div className={styles.welcomePage}>
      <h1>Добро пожаловать в "Терапию настроения"</h1>
      
      <div className={styles.content}>
        <p>
          Перед вами интерактивная версия книги Дэвида Бернса <i>"Терапия настроения. Клинически доказанный способ победить депрессию без таблеток"</i> - практическое руководство 
          по когнитивно-поведенческой терапии. Это не просто электронная книга, а полноценный 
          инструмент для работы над собой.
        </p>

        <h2>Как это работает?</h2>
        <ul>
          <li>Читайте главы книги в удобном для вас темпе</li>
          <li>По мере прохождения материала открываются практические упражнения и тесты</li>
          <li>Выполняйте задания и отслеживайте свой прогресс в календаре</li>
          <li>Все ваши записи сохраняются локально в браузере</li>
        </ul>

        <div className={styles.notice}>
          <h3>Важно знать:</h3>
          <p>
            Вся информация хранится исключительно в вашем браузере для обеспечения 
            конфиденциальности. Однако помните, что при очистке данных браузера ваши записи 
            могут быть удалены.
          </p>
        </div>

        <div className={styles.disclaimer}>
          <p>
            Проект находится в разработке. Новые функции и улучшения добавляются регулярно.
          </p>
          <button 
            className={styles.unlockButton}
            onClick={handleUnlockContent}
          >
            Разблокировать весь контент
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 
