import { FC, useEffect, useCallback } from 'react';
import { useMobile } from '../../store/MobileContext';
import { useProgress } from '../../store/ProgressContext';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';
import { ACTIVITY_IDS } from '../../constants/activities';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const { activeTab, setActiveTab } = useMobile();
  const { progress, dispatch } = useProgress();

  // Функция для определения активного таба на основе текущего контента
  const updateActiveTabBasedOnContent = useCallback(() => {
    if (progress.currentChapter) {
      setActiveTab('chapters');
    } else if (progress.specialContent) {
      if (progress.specialContent === ACTIVITY_IDS.PROGRESS_CALENDAR) {
        setActiveTab('calendar');
      } else if (progress.specialContent === ACTIVITY_IDS.TODAY_TASKS) {
        setActiveTab('today');
      } else if (progress.specialContent === ACTIVITY_IDS.WELCOME) {
        setActiveTab('about');
      } else {
        setActiveTab('activities');
      }
    }
  }, [progress.currentChapter, progress.specialContent, setActiveTab]);

  // Эффект для автоматической установки активного таба в зависимости от текущего контента
  useEffect(() => {
    updateActiveTabBasedOnContent();
  }, [updateActiveTabBasedOnContent]);

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
    // Если есть глава или специальный контент, то показываем MainContent
    if (progress.currentChapter || progress.specialContent) {
      return <MainContent />;
    }

    // Если нет главы и нет специального контента, показываем списки в зависимости от активной вкладки
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
