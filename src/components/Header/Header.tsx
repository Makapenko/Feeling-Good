import { useAppDispatch } from '../../redux/hooks';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faListCheck, faHome } from '@fortawesome/free-solid-svg-icons';
import { ACTIVITY_IDS } from '../../constants/activities';
import { setSpecialContent } from '../../redux/actions';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCalendarClick = () => {
    dispatch(setSpecialContent({ 
      content: ACTIVITY_IDS.PROGRESS_CALENDAR,
      showNotification: false
    }));
  };

  const handleHomeClick = () => {
    dispatch(setSpecialContent({ 
      content: ACTIVITY_IDS.WELCOME,
      showNotification: false
    }));
  };

  const handleTasksClick = () => {
    dispatch(setSpecialContent({ 
      content: ACTIVITY_IDS.TODAY_TASKS,
      showNotification: false
    }));
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
