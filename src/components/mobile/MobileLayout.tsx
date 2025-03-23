import { FC } from 'react';
import { useMobile } from '../../store/MobileContext';
import { useProgress } from '../../store/ProgressContext';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';
import { ACTIVITY_IDS } from '../../constants/activities';

// TODO исправить - при переходе из ежедневных заданий - иконка не переключается на книгу и на активности

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const { activeTab, setActiveTab } = useMobile();
  const { progress, dispatch } = useProgress();

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    
    if (tab === 'calendar') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.PROGRESS_CALENDAR });
    } else if (tab === 'today') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.TODAY_TASKS });
    } else if (tab === 'about') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: ACTIVITY_IDS.WELCOME });
    } else if (tab === 'chapters' || tab === 'activities') {
      dispatch({ type: 'SET_SPECIAL_CONTENT', content: null });
    }
  };

  const renderContent = () => {
    if ((progress.currentChapter && activeTab !== 'activities') || 
        (progress.specialContent && 
         !(activeTab === 'chapters' && 
           progress.specialContent !== ACTIVITY_IDS.PROGRESS_CALENDAR && 
           progress.specialContent !== ACTIVITY_IDS.TODAY_TASKS && 
           progress.specialContent !== ACTIVITY_IDS.WELCOME))) {
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
