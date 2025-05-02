import { FC, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useActiveTab, useCurrentChapter, useSpecialContent } from '../../redux/hooks';
import MobileNavBar from './MobileNavBar';
import ListOfChapters from '../ListOfChapters/ListOfChapters';
import MainContent from '../MainContent/MainContent';
import ActivitiesPanel from '../ActivitiesPanel/ActivitiesPanel';
import styles from './MobileLayout.module.css';
import { ACTIVITY_IDS } from '../../constants/activities';
import { setSpecialContent } from '../../redux/slices/progressSlice';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

const MobileLayout: FC = () => {
  const activeTab = useActiveTab();
  const dispatch = useAppDispatch();
  const currentChapter = useCurrentChapter();
  const specialContent = useSpecialContent();
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Добавляем эффект для принудительного скролла контента к верху при смене контента
  useEffect(() => {
    if (contentWrapperRef.current) {
      // Сбрасываем скролл на самый верх контейнера с задержкой
      setTimeout(() => {
        if (contentWrapperRef.current) {
          contentWrapperRef.current.scrollTop = 0;
          
          // Дополнительно сбрасываем скролл у окна
          window.scrollTo({
            top: 0,
            behavior: 'instant'
          });
        }
      }, 150);
    }
  }, [currentChapter?.id, specialContent]);

  // Получаем нужную панель в зависимости от текущей активной вкладки
  const getCurrentView = useCallback((tab: MobileTab) => {
    // Если у нас есть открытая глава или специальный контент, 
    // показываем основной контент независимо от текущей вкладки
    if (currentChapter || specialContent) {
      return <MainContent />;
    }

    switch (tab) {
      case 'today':
        // Показываем компонент задач на сегодня через MainContent
        dispatch(setSpecialContent(ACTIVITY_IDS.TODAY_TASKS));
        return <MainContent />;
      case 'chapters':
        // Списки глав показываем напрямую, так как они имеют свою механику скроллинга
        return <ListOfChapters />;
      case 'activities':
        // Списки активностей показываем напрямую, так как они имеют свою механику скроллинга
        return <ActivitiesPanel />;
      case 'calendar':
        // Для календаря используем MainContent
        dispatch(setSpecialContent(ACTIVITY_IDS.PROGRESS_CALENDAR));
        return <MainContent />;
      case 'about':
        // Для страницы "О приложении" используем MainContent
        dispatch(setSpecialContent(ACTIVITY_IDS.WELCOME));
        return <MainContent />;
      default:
        return <ListOfChapters />;
    }
  }, [currentChapter, specialContent, dispatch]);

  return (
    <div className={styles.mobileLayout}>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        {getCurrentView(activeTab)}
      </div>
      <MobileNavBar />
    </div>
  );
};

export default MobileLayout; 
