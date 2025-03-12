import { useEffect } from 'react';
import styles from './MainContent.module.css';
import { useProgress } from '../../store/ProgressContext';
import ChapterContainer from '../ChapterReader/ChapterContainer';
import ProgressCalendar from '../ProgressCalendar/ProgressCalendar';

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

const MainContent: React.FC = () => {
  const { progress, dispatch } = useProgress();

  useEffect(() => {
    if (progress.currentChapter?.id) {
      dispatch({ 
        type: 'START_CHAPTER_READING', 
        chapterId: progress.currentChapter.id 
      });
    }
  }, [progress.currentChapter?.id, dispatch]);

  const handleTestComplete = (result: SurveyResult) => {
    console.log('MainContent: отправка результата теста:', result);
    dispatch({
      type: 'SAVE_TEST_RESULT',
      result
    });
  };

  const renderContent = () => {
    if (progress.specialContent === 'burns-checklist') {
      return <Survey config={burnsConfig} onComplete={handleTestComplete} />;
    } else if (progress.specialContent === 'novaco-scale') {
      return <Survey config={novacoConfig} onComplete={handleTestComplete} />;
    } else if (progress.specialContent === 'cognitive-biases') {
      return <ListOfCognitiveBiases />;
    } else if (progress.specialContent === 'cognitive-biases-test') {
      return <TestOfCognitiveBiases />;
    } else if (progress.specialContent === 'three-columns-method') {
      return <ThreeColumnsMethod />;
    } else if (progress.specialContent === 'thought-diary') {
      return <ThoughtDiary />;
    } else if (progress.specialContent === 'daily-schedule') {
      return <DailySchedule />;
    } else if (progress.specialContent === 'anti-procrastination') {
      return <AntiProcrastinationSheet />;
    } else if (progress.specialContent === 'pleasure-sheet') {
      return <PleasureSheet />;
    } else if (progress.specialContent === 'no-buts') {
      return <NoButsSheet />;
    } else if (progress.specialContent === 'self-support') {
      return <SelfSupport />;
    } else if (progress.specialContent === 'self-activation') {
      return <SelfActivationMethods />;
    } else if (progress.specialContent === 'hindering-helping-thoughts') {
      return <HinderingHelpingThoughts />;
    } else if (progress.specialContent === 'disarming-technique') {
      return <DisarmingTechnique />;
    } else if (progress.specialContent === 'motivation-without-coercion') {
      return <MotivationWithoutCoercion />;
    } else if (progress.specialContent === 'no-lose-technique') {
      return <NoLoseTechnique />;
    } else if (progress.specialContent === 'small-steps') {
      return <SmallSteps />;
    } else if (progress.specialContent === 'imagine-success') {
      return <ImagineSuccess />;
    } else if (progress.specialContent === 'count-achievements') {
      return <CountAchievements />;
    } else if (progress.specialContent === 'check-cant-do') {
      return <CheckCantDo />;
    } else if (progress.specialContent === 'progress-calendar') {
      return <ProgressCalendar />;
    }

    if (progress.currentChapter) {
      const { id, content } = progress.currentChapter;
      return (
        <ChapterContainer
          content={content}
          chapterId={id}
        />
      );
    }

    return (
      <div className={styles.welcome}>
        <h2>Выберите главу для изучения</h2>
        <p>Здесь будет текст выбранной главы или задания.</p>
      </div>
    );
  };

  return (
    <>  
      {renderContent()}
    </>
  );
};

export default MainContent;
