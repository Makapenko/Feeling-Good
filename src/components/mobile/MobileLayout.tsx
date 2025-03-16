import { FC } from 'react';
import { useMobile } from '../../store/MobileContext';
import { useProgress } from '../../store/ProgressContext';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';

// TODO исправить - при переходе из ежедневных заданий - иконка не переключается на книгу и на активности

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const { activeTab, setActiveTab } = useMobile();
  const { progress, dispatch } = useProgress();

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === 'calendar') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'progress-calendar' });
    } else if (tab === 'today') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'today-tasks' });
    } else if (tab === 'about') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: 'welcome' });
    } else if (tab === 'chapters' || tab === 'activities') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: null });
    }
  };

  const renderContent = () => {
    if ((progress.currentChapter && activeTab !== 'activities') || 
        (progress.specialContent && 
         !(activeTab === 'chapters' && progress.specialContent !== 'progress-calendar' && 
           progress.specialContent !== 'today-tasks' && progress.specialContent !== 'welcome'))) {
      return <MainContent />;
    }

    switch (activeTab) {
      case 'chapters':
        return <ListOfChapters />;
      case 'activities':
        return <ActivitiesPanel />;
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
