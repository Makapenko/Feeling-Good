import { FC, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faBookOpen,
  faTasks,
  faCircleInfo,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './MobileNavBar.module.css';
import { useAppDispatch, useActiveTab, useCurrentChapter, useSpecialContent } from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';
import { setActiveTab } from '../../redux/slices/mobileSlice';
import { ACTIVITY_IDS } from '../../constants/activities';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

interface NavItem {
  id: MobileTab;
  icon: IconDefinition;
  label: string;
}

const navItems: NavItem[] = [
  {
    id: 'today',
    icon: faCalendarDay,
    label: 'Сегодня'
  },
  {
    id: 'chapters',
    icon: faBookOpen,
    label: 'Книга'
  },
  {
    id: 'activities',
    icon: faTasks,
    label: 'Задания'
  },
  {
    id: 'calendar',
    icon: faCalendarAlt,
    label: 'Календарь'
  },
  {
    id: 'about',
    icon: faCircleInfo,
    label: 'О проекте'
  }
];

const MobileNavBar: FC = () => {
  const activeTab = useActiveTab();
  const dispatch = useAppDispatch();
  const currentChapter = useCurrentChapter();
  const specialContent = useSpecialContent();
  
  // Эффект для обновления активного таба при изменении контента
  useEffect(() => {
    // Если у нас есть активная глава, активируем вкладку "Книга"
    if (currentChapter) {
      dispatch(setActiveTab('chapters'));
      return;
    }
    
    // Если у нас есть специальный контент, проверяем какой именно
    if (specialContent) {
      // Исключения - для этих типов контента мы используем соответствующие вкладки
      if (specialContent === ACTIVITY_IDS.TODAY_TASKS) {
        dispatch(setActiveTab('today'));
      } else if (specialContent === ACTIVITY_IDS.WELCOME) {
        dispatch(setActiveTab('about'));
      } else if (specialContent === ACTIVITY_IDS.PROGRESS_CALENDAR) {
        dispatch(setActiveTab('calendar'));
      } else {
        // Для всех остальных типов заданий активируем вкладку "Задания"
        dispatch(setActiveTab('activities'));
      }
    }
  }, [currentChapter, specialContent, dispatch]);
  
  const handleTabChange = (tab: MobileTab) => {
    dispatch(setActiveTab(tab));

    // В зависимости от выбранной вкладки устанавливаем специальный контент
    if (tab === 'calendar') {
      dispatch(setSpecialContent(ACTIVITY_IDS.PROGRESS_CALENDAR));
    } else if (tab === 'today') {
      dispatch(setSpecialContent(ACTIVITY_IDS.TODAY_TASKS));
    } else if (tab === 'about') {
      dispatch(setSpecialContent(ACTIVITY_IDS.WELCOME));
    } else if (tab === 'chapters' || tab === 'activities') {
      dispatch(setSpecialContent(null));
    }
  };

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => handleTabChange(item.id)}
        >
          <FontAwesomeIcon icon={item.icon} className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNavBar;
