import { FC } from 'react';
import { useMobile } from '../../store/MobileContext';
import { useProgress } from '../../store/ProgressContext';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const { activeTab, setActiveTab } = useMobile();
  const { dispatch } = useProgress();

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === 'calendar') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'progress-calendar' });
    } else if (tab === 'about') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'welcome' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chapters':
        return <ListOfChapters />;
      case 'activities':
        return <ActivitiesPanel />;
      case 'today':
        return <MainContent />;
      case 'calendar':
      case 'about':
        return <MainContent />;
      default:
        return <MainContent />;
    }
  };

  return (
    <div className={styles.mobileLayout}>
      <div className={styles.content}>
        {renderContent()}
      </div>
      <MobileNavBar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

export default MobileLayout; 
