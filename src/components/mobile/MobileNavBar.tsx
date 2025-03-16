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
}

const navItems: NavItem[] = [
  {
    id: 'today',
    icon: faCalendarDay
  },
  {
    id: 'chapters',
    icon: faBookOpen
  },
  {
    id: 'activities',
    icon: faTasks
  },
  {
    id: 'calendar',
    icon: faCalendarAlt
  },
  {
    id: 'about',
    icon: faCircleInfo
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
        </button>
      ))}
    </nav>
  );
};

export default MobileNavBar;
