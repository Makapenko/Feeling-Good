import { useEffect } from 'react';
import styles from './MainContent.module.css';
import { useProgress } from '../../store/ProgressContext';
import { useMobile } from '../../store/MobileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChapterContainer from '../ChapterReader/ChapterContainer';
import ProgressCalendar from '../ProgressCalendar/ProgressCalendar';
import TodayTasks from '../Activities/TodayTasks/TodayTasks';

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

  const renderContent = () => {
    switch (progress.specialContent) {
      case 'welcome':
        return <WelcomePage />;
      case 'burns-checklist':
        return <Survey config={burnsConfig} onComplete={handleTestComplete} />;
      case 'today-tasks':
        return <TodayTasks />;
      case 'novaco-scale':
        return <Survey config={novacoConfig} onComplete={handleTestComplete} />;
      case 'cognitive-biases':
        return <ListOfCognitiveBiases />;
      case 'cognitive-biases-test':
        return <TestOfCognitiveBiases onComplete={handleTestComplete} />;
      case 'three-columns-method':
        return <ThreeColumnsMethod />;
      case 'thought-diary':
        return <ThoughtDiary />;
      case 'daily-schedule':
        return <DailySchedule />;
      case 'anti-procrastination':
        return <AntiProcrastinationSheet />;
      case 'pleasure-sheet':
        return <PleasureSheet />;
      case 'no-buts':
        return <NoButsSheet />;
      case 'self-support':
        return <SelfSupport />;
      case 'self-activation':
        return <SelfActivationMethods />;
      case 'hindering-helping-thoughts':
        return <HinderingHelpingThoughts />;
      case 'disarming-technique':
        return <DisarmingTechnique />;
      case 'motivation-without-coercion':
        return <MotivationWithoutCoercion />;
      case 'no-lose-technique':
        return <NoLoseTechnique />;
      case 'small-steps':
        return <SmallSteps />;
      case 'imagine-success':
        return <ImagineSuccess />;
      case 'count-achievements':
        return <CountAchievements />;
      case 'check-cant-do':
        return <CheckCantDo />;
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
