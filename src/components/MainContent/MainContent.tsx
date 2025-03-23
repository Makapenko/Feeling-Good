import { useEffect } from 'react';
import styles from './MainContent.module.css';
import { useProgress } from '../../store/ProgressContext';
import { useMobile } from '../../store/MobileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChapterContainer from '../ChapterReader/ChapterContainer';
import ProgressCalendar from '../ProgressCalendar/ProgressCalendar';
import TodayTasks from '../TodayTasks/TodayTasks';

import Survey, { burnsConfig, novacoConfig } from '../Activities/Survey';
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

  //TODO - переписать  case - много повторяющихся строк
  //TODO - сделать возвращение вверх экрана при переходе между главами и техниками

  const renderContent = () => {
    switch (progress.specialContent) {
      case 'welcome':
        return <WelcomePage />;
      case 'burns-checklist':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <Survey config={burnsConfig} onComplete={handleTestComplete} />
          </>
        );
      case 'today-tasks':
        return <TodayTasks />;
      case 'novaco-scale':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <Survey config={novacoConfig} onComplete={handleTestComplete} />
          </>
        );
      case 'cognitive-biases':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <ListOfCognitiveBiases />
          </>
        );
      case 'cognitive-biases-test':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <TestOfCognitiveBiases onComplete={handleTestComplete} />
          </>
        );
      case 'three-columns-method':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <ThreeColumnsMethod />
          </>
        );
      case 'thought-diary':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <ThoughtDiary />
          </>
        );
      case 'daily-schedule':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <DailySchedule />
          </>
        );
      case 'anti-procrastination':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <AntiProcrastinationSheet />
          </>
        );
      case 'pleasure-sheet':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <PleasureSheet />
          </>
        );
      case 'no-buts':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <NoButsSheet />
          </>
        );
      case 'self-support':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <SelfSupport />
          </>
        );
      case 'self-activation':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <SelfActivationMethods />
          </>
        );
      case 'hindering-helping-thoughts':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <HinderingHelpingThoughts />
          </>
        );
      case 'disarming-technique':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <DisarmingTechnique />
          </>
        );
      case 'motivation-without-coercion':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <MotivationWithoutCoercion />
          </>
        );
      case 'no-lose-technique':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <NoLoseTechnique />
          </>
        );
      case 'small-steps':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <SmallSteps />
          </>
        );
      case 'imagine-success':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <ImagineSuccess />
          </>
        );
      case 'count-achievements':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <CountAchievements />
          </>
        );
      case 'check-cant-do':
        return (
          <>
            <div className={styles.mobileBackButton} onClick={handleBackToActivities}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>К списку заданий</span>
            </div>
            <CheckCantDo />
          </>
        );
      case 'progress-calendar':
        return <ProgressCalendar />;
      default:
        if (progress.currentChapter) {
          const { id, content } = progress.currentChapter;
          return (
            <>
              <div className={styles.mobileBackButton} onClick={handleBackToChapters}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>К списку глав</span>
              </div>
              <ChapterContainer
                content={content}
                chapterId={id}
              />
            </>
          );
        }
        return (
          <div className={styles.welcome}>
            <h2>Выберите главу для изучения</h2>
            <p>Здесь будет текст выбранной главы или задания.</p>
          </div>
        );
    }
  };

  return (
    <>  
      {renderContent()}
    </>
  );
};

export default MainContent;
