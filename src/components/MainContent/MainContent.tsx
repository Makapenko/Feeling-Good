import { useEffect } from 'react';
import styles from './MainContent.module.css';
import { useProgress } from '../../store/ProgressContext';
import { useMobile } from '../../store/MobileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChapterContainer from '../ChapterReader/ChapterContainer';
import ProgressCalendar from '../ProgressCalendar/ProgressCalendar';
import TodayTasks from '../TodayTasks/TodayTasks';

import { SurveyResult } from '../Activities/Survey/types';
import ListOfCognitiveBiases from '../Activities/ListOfCognitiveBiases/ListOfCognitiveBiases';
import TestOfCognitiveBiases from '../Activities/TestOfCognitiveBiases/TestOfCognitiveBiases';
import ThreeColumnsMethod  from '../Activities/ThreeColumnsMethod/ThreeColumnsMethod';
import ThoughtDiary from '../Activities/ThoughtDiary/ThoughtDiary';
import DailySchedule from '../Activities/DailySchedule/DailySchedule';
import AntiProcrastinationSheet from '../Activities/AntiProcrastinationSheet/AntiProcrastinationSheet';
import PleasureSheet from '../Activities/PleasureSheet/PleasureSheet';
import NoButsSheet from '../Activities/NoButsSheet/NoButsSheet';
import SelfSupport from '../Activities/SelfSupport/SelfSupport';
import SelfActivationMethods from '../Activities/SelfActivationMethods/SelfActivationMethods';
import HinderingHelpingThoughts from '../Activities/HinderingHelpingThoughts/HinderingHelpingThoughts';
import MotivationWithoutCoercion from '../Activities/MotivationWithoutCoercion/MotivationWithoutCoercion';
import NoLoseTechnique from '../Activities/NoLoseTechnique/NoLoseTechnique';
import SmallSteps from '../Activities/SmallSteps/SmallSteps';
import ImagineSuccess from '../Activities/ImagineSuccess/ImagineSuccess';
import CountAchievements from '../Activities/CountAchievements/CountAchievements';
import CheckCantDo from '../Activities/CheckCantDo/CheckCantDo';
import DisarmingTechnique from '../Activities/DisarmingTechnique/DisarmingTechnique';
import WelcomePage from '../WelcomePage/WelcomePage';
import BurnsChecklist from '../Activities/BurnsChecklist';
import NovacoScale from '../Activities/NovacoScale';

// Определяем маппинг компонентов активностей
const ACTIVITY_COMPONENTS = {
  'welcome': WelcomePage,
  'burns-checklist': BurnsChecklist,
  'today-tasks': TodayTasks,
  'novaco-scale': NovacoScale,
  'cognitive-biases': ListOfCognitiveBiases,
  'cognitive-biases-test': TestOfCognitiveBiases,
  'three-columns-method': ThreeColumnsMethod,
  'thought-diary': ThoughtDiary,
  'daily-schedule': DailySchedule,
  'anti-procrastination': AntiProcrastinationSheet,
  'pleasure-sheet': PleasureSheet,
  'no-buts': NoButsSheet,
  'self-support': SelfSupport,
  'self-activation': SelfActivationMethods,
  'hindering-helping-thoughts': HinderingHelpingThoughts,
  'disarming-technique': DisarmingTechnique,
  'motivation-without-coercion': MotivationWithoutCoercion,
  'no-lose-technique': NoLoseTechnique,
  'small-steps': SmallSteps,
  'imagine-success': ImagineSuccess,
  'count-achievements': CountAchievements,
  'check-cant-do': CheckCantDo,
  'progress-calendar': ProgressCalendar
};

const MainContent: React.FC = () => {
  const { progress, dispatch } = useProgress();
  const { setActiveTab } = useMobile();

  useEffect(() => {
    if (progress.currentChapter?.id) {
      dispatch({ 
        type: 'START_CHAPTER_READING', 
        chapterId: progress.currentChapter.id 
      });
    }
  }, [progress.currentChapter?.id, dispatch]);

  // Эффект для прокрутки страницы наверх при смене контента
  useEffect(() => {
    // Прокручиваем страницу наверх только при изменении ID главы или типа специального контента
    window.scrollTo(0, 0);
  }, [progress.currentChapter?.id, progress.specialContent]);

  const handleTestComplete = (result: SurveyResult) => {
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  const handleBackToChapters = () => {
    dispatch({ type: 'SET_CURRENT_CHAPTER', chapter: null });
    setActiveTab('chapters');
  };

  const handleBackToActivities = () => {
    dispatch({ type: 'SET_SPECIAL_CONTENT', content: null });
    setActiveTab('activities');
  };

  // Компонент обёртка для активностей с кнопкой "назад"
  const ActivityWithBackButton = ({ children }: { children: React.ReactNode }) => (
    <>
      <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>К списку заданий</span>
      </div>
      {children}
    </>
  );

  // Рендерим контент в зависимости от текущей активности
  const renderContent = () => {
    const specialContent = progress.specialContent as keyof typeof ACTIVITY_COMPONENTS;
    
    // Специальные случаи
    if (specialContent === 'today-tasks') {
      return <TodayTasks />;
    }
    
    if (specialContent === 'progress-calendar') {
      return <ProgressCalendar />;
    }
    
    if (specialContent === 'cognitive-biases-test') {
      return (
        <ActivityWithBackButton>
          <TestOfCognitiveBiases onComplete={handleTestComplete} />
        </ActivityWithBackButton>
      );
    }
    
    // Основной контент из маппинга активностей
    if (specialContent && ACTIVITY_COMPONENTS[specialContent]) {
      const ActivityComponent = ACTIVITY_COMPONENTS[specialContent];
      
      if (specialContent === 'welcome') {
        return <ActivityComponent />;
      }
      
      return (
        <ActivityWithBackButton>
          <ActivityComponent />
        </ActivityWithBackButton>
      );
    }
    
    // Рендеринг главы или дефолтного контента
    if (progress.currentChapter) {
      const { id, content } = progress.currentChapter;
      return (
        <>
          <div className={styles.mobileBackButton} onClick={handleBackToChapters}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>К списку глав</span>
          </div>
          <ChapterContainer content={content} chapterId={id} />
        </>
      );
    }
    
    // Дефолтное сообщение
    return (
      <div className={styles.welcome}>
        <h2>Выберите главу для изучения</h2>
        <p>Здесь будет текст выбранной главы или задания.</p>
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default MainContent;
