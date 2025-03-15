import { FC } from 'react';
import { useMobile } from '../../store/MobileContext';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';

const MobileLayout: FC = () => {
  const { activeTab, setActiveTab } = useMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'chapters':
        return <ListOfChapters />;
      case 'activities':
        return <ActivitiesPanel />;
      case 'today':
        return <MainContent />;
      case 'calendar':
        return <div>Календарь прогресса</div>;
      case 'about':
        return <div>О приложении</div>;
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
        onTabChange={(tab) => setActiveTab(tab as any)} 
      />
    </div>
  );
};

export default MobileLayout; 
