import { useEffect, useState } from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header';
import ListOfChapters from './components/ListOfChapters/ListOfChapters';
import MainContent from './components/MainContent/MainContent';
import ActivitiesPanel from './components/ActivitiesPanel/ActivitiesPanel';
import MobileLayout from './components/mobile/MobileLayout';
import { ProgressProvider } from './store/ProgressContext';
import { MobileProvider } from './store/MobileContext';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <ProgressProvider>
      <MobileProvider>
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
      </MobileProvider>
    </ProgressProvider>
  );
}

export default App; 
