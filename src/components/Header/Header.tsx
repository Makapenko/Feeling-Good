import { useProgress } from '../../store/ProgressContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { dispatch } = useProgress();

  const handleCalendarClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'progress-calendar' });
  };

  const handleTitleClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'welcome' });
  };

  return (
    <header className={styles.header}>
      <h1 
        onClick={handleTitleClick}
        className={styles.title}
      >
        Терапия настроения
      </h1>
      <button 
        className={styles.calendarButton}
        onClick={handleCalendarClick}
      >
        Календарь прогресса
      </button>
    </header>
  );
};

export default Header;
