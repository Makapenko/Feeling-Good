import { useEffect } from 'react';
import styles from './MainContent.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
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
import { ACTIVITY_IDS } from '../../constants/activities';
import { setCurrentChapter, setSpecialContent, startChapterReading } from '../../redux/slices/progressSlice';
import { setActiveTab } from '../../redux/slices/mobileSlice';
import { saveTestResultWithNotification } from '../../redux/actions';

// Определяем маппинг компонентов активностей
const ACTIVITY_COMPONENTS = {
  [ACTIVITY_IDS.WELCOME]: WelcomePage,
  [ACTIVITY_IDS.BURNS_CHECKLIST]: BurnsChecklist,
  [ACTIVITY_IDS.TODAY_TASKS]: TodayTasks,
  [ACTIVITY_IDS.NOVACO_SCALE]: NovacoScale,
  [ACTIVITY_IDS.COGNITIVE_BIASES]: ListOfCognitiveBiases,
  [ACTIVITY_IDS.COGNITIVE_BIASES_TEST]: TestOfCognitiveBiases,
  [ACTIVITY_IDS.THREE_COLUMNS_METHOD]: ThreeColumnsMethod,
  [ACTIVITY_IDS.THOUGHT_DIARY]: ThoughtDiary,
  [ACTIVITY_IDS.DAILY_SCHEDULE]: DailySchedule,
  [ACTIVITY_IDS.ANTI_PROCRASTINATION]: AntiProcrastinationSheet,
  [ACTIVITY_IDS.PLEASURE_SHEET]: PleasureSheet,
  [ACTIVITY_IDS.NO_BUTS]: NoButsSheet,
  [ACTIVITY_IDS.SELF_SUPPORT]: SelfSupport,
  [ACTIVITY_IDS.SELF_ACTIVATION]: SelfActivationMethods,
  [ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS]: HinderingHelpingThoughts,
  [ACTIVITY_IDS.DISARMING_TECHNIQUE]: DisarmingTechnique,
  [ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION]: MotivationWithoutCoercion,
  [ACTIVITY_IDS.NO_LOSE_TECHNIQUE]: NoLoseTechnique,
  [ACTIVITY_IDS.SMALL_STEPS]: SmallSteps,
  [ACTIVITY_IDS.IMAGINE_SUCCESS]: ImagineSuccess,
  [ACTIVITY_IDS.COUNT_ACHIEVEMENTS]: CountAchievements,
  [ACTIVITY_IDS.CHECK_CANT_DO]: CheckCantDo,
  [ACTIVITY_IDS.PROGRESS_CALENDAR]: ProgressCalendar
};

const MainContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  
  useEffect(() => {
    if (progress.currentChapter?.id) {
      dispatch(startChapterReading(progress.currentChapter.id));
    }
  }, [progress.currentChapter?.id, dispatch]);

  // Эффект для прокрутки страницы наверх при смене контента
  useEffect(() => {
    // Прокручиваем страницу наверх только при изменении ID главы или типа специального контента
    window.scrollTo(0, 0);
  }, [progress.currentChapter?.id, progress.specialContent]);

  const handleTestComplete = (result: SurveyResult) => {
    dispatch(saveTestResultWithNotification({
      testResult: result,
      showNotification: false 
    }));
  };

  const handleBackToChapters = () => {
    dispatch(setCurrentChapter(null));
    dispatch(setActiveTab('chapters'));
  };

  const handleBackToActivities = () => {
    dispatch(setSpecialContent(null));
    dispatch(setActiveTab('activities'));
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
