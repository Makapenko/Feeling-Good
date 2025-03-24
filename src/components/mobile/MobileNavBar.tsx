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

interface MobileNavBarProps {
  activeTab: MobileTab;
  onTabChange: (tabId: MobileTab) => void;
}

const MobileNavBar: FC<MobileNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <FontAwesomeIcon icon={item.icon} className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNavBar;
