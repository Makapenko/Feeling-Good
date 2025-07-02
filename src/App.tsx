import { useEffect } from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header';
import ListOfChapters from './components/ListOfChapters/ListOfChapters';
import MainContent from './components/MainContent/MainContent';
import ActivitiesPanel from './components/ActivitiesPanel/ActivitiesPanel';
import MobileLayout from './components/mobile/MobileLayout';
import NotificationContainer from './components/Notification/NotificationContainer';
import UnlockNotifier from './components/Notification/UnlockNotifier';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { migrateDataToRedux } from './redux/migrateLegacyData';
import { useIsMobile } from './utils/deviceUtils';
// TODO: Задания из введений не отображаются в ActivitiesPanel
function App() {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Запускаем миграцию данных
    migrateDataToRedux();
  }, []);

  return (
    <Provider store={store}>
      <UnlockNotifier />
      <NotificationContainer />
      {isMobile ? (
        <MobileLayout />
      ) : (
        <div className={styles.appLayout}>
          <header className={styles.header}>
            <Header />
          </header>
          <nav className={styles.chaptersPanel}>
            <ListOfChapters />
          </nav>
          <main className={styles.mainContent}>
            <MainContent />
          </main>
          <aside className={styles.activitiesPanel}>
            <ActivitiesPanel />
          </aside>
        </div>
      )}
    </Provider>
  );
}

export default App; 
