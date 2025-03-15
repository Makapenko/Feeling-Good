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

interface NavItem {
  id: string;
  icon: IconDefinition;
  label: string;
}

const navItems: NavItem[] = [
  {
    id: 'today',
    icon: faCalendarDay,
    label: 'Задания на сегодня'
  },
  {
    id: 'chapters',
    icon: faBookOpen,
    label: 'Список глав'
  },
  {
    id: 'activities',
    icon: faTasks,
    label: 'Доступные задания'
  },
  {
    id: 'calendar',
    icon: faCalendarAlt,
    label: 'Календарь'
  },
  {
    id: 'about',
    icon: faCircleInfo,
    label: 'О приложении'
  }
];

interface MobileNavBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
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
