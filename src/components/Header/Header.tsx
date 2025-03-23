import { useProgress } from '../../store/ProgressContext';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faListCheck, faHome } from '@fortawesome/free-solid-svg-icons';
import { ACTIVITY_IDS } from '../../constants/activities';

const Header: React.FC = () => {
  const { dispatch } = useProgress();

  const handleCalendarClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.PROGRESS_CALENDAR });
  };

  const handleHomeClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.WELCOME });
  };

  const handleTasksClick = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.TODAY_TASKS });
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleContainer}>
          <FontAwesomeIcon
            icon={faHome}
            className={styles.homeIcon}
            onClick={handleHomeClick}
          />
          <h1
            onClick={handleHomeClick}
            className={styles.title}
          >
            Терапия настроения
          </h1>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={styles.iconButton}
            onClick={handleTasksClick}
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
