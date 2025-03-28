import { FC } from 'react';
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
import { useAppDispatch, useActiveTab } from '../../redux/hooks';
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
