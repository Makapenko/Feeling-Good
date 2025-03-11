import styles from './App.module.css';
import Header from './components/Header/Header';
import ListOfChapters from './components/ListOfChapters/ListOfChapters';
import MainContent from './components/MainContent/MainContent';
import ActivitiesPanel from './components/ActivitiesPanel/ActivitiesPanel';
import { ProgressProvider } from './store/ProgressContext';

function App() {
  return (
    <ProgressProvider>
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
    </ProgressProvider>
  );
}

export default App; 
