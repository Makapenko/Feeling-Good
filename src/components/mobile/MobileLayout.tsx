import { FC, useCallback } from 'react';
import { useAppSelector } from '../../redux/hooks';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';
import { ACTIVITY_IDS } from '../../constants/activities';
import { useAppDispatch } from '../../redux/hooks';
import { setSpecialContent } from '../../redux/slices/progressSlice';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const activeTab = useAppSelector(state => state.mobile.activeTab);
  const dispatch = useAppDispatch();
  const currentChapter = useAppSelector(state => state.progress.currentChapter);
  const specialContent = useAppSelector(state => state.progress.specialContent);

  // Получаем нужную панель в зависимости от текущей активной вкладки
  const getCurrentView = useCallback((tab: MobileTab) => {
    // Если у нас есть открытая глава или специальный контент, 
    // показываем основной контент независимо от текущей вкладки
    if (currentChapter || specialContent) {
      return <MainContent />;
    }

    switch (tab) {
      case 'today':
        // Показываем компонент задач на сегодня
        dispatch(setSpecialContent(ACTIVITY_IDS.TODAY_TASKS));
        return <MainContent />;
      case 'chapters':
        return <ListOfChapters />;
      case 'activities':
        return <ActivitiesPanel />;
      case 'calendar':
        dispatch(setSpecialContent(ACTIVITY_IDS.PROGRESS_CALENDAR));
        return <MainContent />;
      case 'about':
        dispatch(setSpecialContent(ACTIVITY_IDS.WELCOME));
        return <MainContent />;
      default:
        return <ListOfChapters />;
    }
  }, [currentChapter, specialContent, dispatch]);

  return (
    <div className={styles.mobileLayout}>
      <div className={styles.contentWrapper}>
        {getCurrentView(activeTab)}
      </div>
      <MobileNavBar />
    </div>
  );
};

export default MobileLayout; 
