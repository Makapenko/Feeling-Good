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

  const handleTodayTasksClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'today-tasks' });
  };

  return (
    <header className={styles.header}>
      <h1 
        onClick={handleTitleClick}
        className={styles.title}
      >
        Терапия настроения
      </h1>
      <div className={styles.buttonGroup}>
        <button 
          className={styles.headerButton}
          onClick={handleTodayTasksClick}
        >
          Задания на сегодня
        </button>
        <button 
          className={styles.headerButton}
          onClick={handleCalendarClick}
        >
          Календарь прогресса
        </button>
      </div>
    </header>
  );
};

export default Header;
