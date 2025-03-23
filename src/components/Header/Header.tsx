import { useProgress } from '../../store/ProgressContext';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faListCheck, faHome } from '@fortawesome/free-solid-svg-icons';

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
      <div className={styles.headerContent}>
        <div className={styles.titleContainer}>
          <FontAwesomeIcon
            icon={faHome}
            className={styles.homeIcon}
            onClick={handleTitleClick}
          />
          <h1
            onClick={handleTitleClick}
            className={styles.title}
          >
            Терапия настроения
          </h1>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={styles.iconButton}
            onClick={handleTodayTasksClick}
            title="Задания на сегодня"
            aria-label="Задания на сегодня"
          >
            <FontAwesomeIcon icon={faListCheck} className={styles.buttonIcon} />
          </button>
          <button
            className={styles.iconButton}
            onClick={handleCalendarClick}
            title="Календарь прогресса"
            aria-label="Календарь прогресса"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
