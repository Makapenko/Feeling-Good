import { useEffect, useCallback } from 'react';
import styles from './MainContent.module.css';
import { useAppDispatch, useCurrentChapter, useSpecialContent } from '../../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChapterContainer from '../ChapterReader/ChapterContainer';
import ProgressCalendar from '../ProgressCalendar/ProgressCalendar';
import TodayTasks from '../TodayTasks/TodayTasks';
import UniversalTimer from '../UniversalTimer/UniversalTimer';

import ListOfCognitiveBiases from '../Activities/ListOfCognitiveBiases/ListOfCognitiveBiases';
import TestOfCognitiveBiases from '../Activities/TestOfCognitiveBiases/TestOfCognitiveBiases';
import ThreeColumnsMethod  from '../Activities/ThreeColumnsMethod/ThreeColumnsMethod';
import ThoughtDiary from '../Activities/ThoughtDiary/ThoughtDiary';
import ImageryScenesDiary from '../Activities/ImageryScenesDiary/ImageryScenesDiary';
import ProcrastinationDiary from '../Activities/ProcrastinationDiary/ProcrastinationDiary';
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
import BurnsChecklist from '../Activities/BurnsChecklist/BurnsChecklist';
import NovacoScale from '../Activities/NovacoScale/NovacoScale';
import HotCoolThoughts from '../Activities/HotCoolThoughts/HotCoolThoughts';
import RewriteShouldRules from '../Activities/RewriteShouldRules/RewriteShouldRules';
import RationalResponses from '../Activities/RationalResponses/RationalResponses';
import DownwardArrow from '../Activities/DownwardArrow/DownwardArrow';
import DysfunctionalAttitudeScale from '../Activities/DysfunctionalAttitudeScale/DysfunctionalAttitudeScale';
import AdvantagesDisadvantages from '../Activities/AdvantagesDisadvantages/AdvantagesDisadvantages';
import ProcrastinationScale from '../Activities/ProcrastinationScale/ProcrastinationScale';
import VerbalJudo from '../Activities/VerbalJudo/VerbalJudo';
import CriticismManagementMethods from '../Activities/CriticismManagementMethods/CriticismManagementMethods';
import AngerProsCons from '../Activities/AngerProsCons/AngerProsCons';
import ReasonsShouldRefutation from '../Activities/ReasonsShouldRefutation/ReasonsShouldRefutation';
import RewriteBelief from '../Activities/RewriteBelief/RewriteBelief';
import SelfWorthMemo from '../Activities/SelfWorthMemo/SelfWorthMemo';
import RejectionResponse from '../Activities/RejectionResponse/RejectionResponse';
import LoveAddictionDisadvantages from '../Activities/LoveAddictionDisadvantages/LoveAddictionDisadvantages';
import BeliefCorrection from '../Activities/BeliefCorrection/BeliefCorrection';
import SelfCriticismResponse from '../Activities/SelfCriticismResponse/SelfCriticismResponse';
import SelfEsteemMemo from '../Activities/SelfEsteemMemo/SelfEsteemMemo';
import UniversalCounter from '../Activities/UniversalCounter/UniversalCounter';
import LonelinessScale from '../Activities/LonelinessScale/LonelinessScale';
import IntimacyScale from '../Activities/IntimacyScale/IntimacyScale';
import MoodJournal from '../Activities/MoodJournal/MoodJournal';

import WelcomePage from '../WelcomePage/WelcomePage';
import { ACTIVITY_IDS } from '../../constants/activities';
import { setCurrentChapter, setSpecialContent, startChapterReading, updateChapterProgress } from '../../redux/slices/progressSlice';
import { setActiveTab } from '../../redux/slices/mobileSlice';

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
  [ACTIVITY_IDS.PROCRASTINATION_DIARY]: ProcrastinationDiary,
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
  [ACTIVITY_IDS.HOT_COOL_THOUGHTS]: HotCoolThoughts,
  [ACTIVITY_IDS.IMAGERY_SCENES_DIARY]: ImageryScenesDiary,
  [ACTIVITY_IDS.REWRITE_SHOULD_RULES]: RewriteShouldRules,
  [ACTIVITY_IDS.RATIONAL_RESPONSES]: RationalResponses,
  [ACTIVITY_IDS.DOWNWARD_ARROW]: DownwardArrow,
  [ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES]: AdvantagesDisadvantages,
  [ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE]: DysfunctionalAttitudeScale,
  [ACTIVITY_IDS.PROCRASTINATION_SCALE]: ProcrastinationScale,
  [ACTIVITY_IDS.PROGRESS_CALENDAR]: ProgressCalendar,
  [ACTIVITY_IDS.VERBAL_JUDO]: VerbalJudo,
  [ACTIVITY_IDS.CRITICISM_MANAGEMENT_METHODS]: CriticismManagementMethods,
  [ACTIVITY_IDS.ANGER_PROS_CONS]: AngerProsCons,
  [ACTIVITY_IDS.REASONS_SHOULD_REFUTATION]: ReasonsShouldRefutation,
  [ACTIVITY_IDS.REWRITE_BELIEF]: RewriteBelief,
  [ACTIVITY_IDS.SELF_WORTH_MEMO]: SelfWorthMemo,
  [ACTIVITY_IDS.REJECTION_RESPONSE]: RejectionResponse,
  [ACTIVITY_IDS.LOVE_ADDICTION_DISADVANTAGES]: LoveAddictionDisadvantages,
  [ACTIVITY_IDS.BELIEF_CORRECTION]: BeliefCorrection,
  [ACTIVITY_IDS.SELF_CRITICISM_RESPONSE]: SelfCriticismResponse,
  [ACTIVITY_IDS.SELF_ESTEEM_MEMO]: SelfEsteemMemo,
  [ACTIVITY_IDS.LONELINESS_SCALE]: LonelinessScale,
  [ACTIVITY_IDS.INTIMACY_SCALE]: IntimacyScale,
  [ACTIVITY_IDS.MOOD_JOURNAL]: MoodJournal,
  [ACTIVITY_IDS.LONELINESS_PLEASURE_SHEET]: () => (
    <PleasureSheet
      activityId={ACTIVITY_IDS.LONELINESS_PLEASURE_SHEET}
      title="Бланк предполагаемого удовольствия"
      description="Проверьте гипотезу: «Я не могу быть счастливым и довольным, когда я один (одна)». Запланируйте творческие занятия — как в компании, так и в одиночку. Оцените предполагаемое удовольствие до занятия и реальное — после. Сравните результаты: часто реальное удовольствие оказывается выше, чем мы ожидаем!"
      activityLabel="Занятие, которое может принести удовольствие или личностный рост"
      activityPlaceholder="Например: пробежка, приготовление ужина, прогулка..."
      participantsLabel="С кем? (если в одиночку — напишите «с собой»)"
      participantsPlaceholder='Напишите "с собой" или имя'
    />
  ),
  [ACTIVITY_IDS.NEGATIVE_THOUGHTS_COUNTER]: () => <UniversalCounter counterId={ACTIVITY_IDS.NEGATIVE_THOUGHTS_COUNTER} />,
  [ACTIVITY_IDS.SHOULD_COUNTER]: () => <UniversalCounter counterId={ACTIVITY_IDS.SHOULD_COUNTER} />,
  [ACTIVITY_IDS.INNER_LIGHT]: () => <UniversalCounter counterId={ACTIVITY_IDS.INNER_LIGHT} />,
  [ACTIVITY_IDS.DONE_RIGHT_COUNTER]: () => <UniversalCounter counterId={ACTIVITY_IDS.DONE_RIGHT_COUNTER} />,
};

const MainContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentChapter = useCurrentChapter();
  const specialContent = useSpecialContent();
  
  useEffect(() => {
    if (currentChapter?.id) {
      dispatch(startChapterReading(currentChapter.id));
    }
  }, [currentChapter?.id, dispatch]);

  // Эффект для прокрутки страницы наверх при смене контента
  useEffect(() => {
    // Сначала проверяем, находимся ли мы на мобильном устройстве
    const isMobile = window.innerWidth <= 768;
    
    // Добавляем небольшую задержку для мобильных устройств, чтобы DOM успел обновиться
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }, 100);
    } else {
      // На десктопе используем мгновенный скролл
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, [currentChapter?.id, specialContent]);

  // Функция для обновления времени главы, если это необходимо
  const handleChapterTimeUpdate = useCallback((timeSpent: number) => {
    if (currentChapter?.id) {
      dispatch(updateChapterProgress({ chapterId: currentChapter.id, timeSpent })); 
    }
  }, [currentChapter?.id, dispatch]);

  const handleBackToChapters = () => {
    dispatch(setCurrentChapter(null));
    dispatch(setActiveTab('chapters'));
  };

  const handleBackToActivities = () => {
    dispatch(setSpecialContent(null));
    dispatch(setActiveTab('activities'));
  };

  // Получаем ID текущего контента для таймера
  const getCurrentContentId = () => {
    if (specialContent) {
      return specialContent; // Возвращаем ID специального контента
    }
    if (currentChapter?.id) {
      return currentChapter.id; // Возвращаем ID главы
    }
    return 'default'; // Дефолтное значение
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
    const specialContentType = specialContent as keyof typeof ACTIVITY_COMPONENTS;
    
    // Специальные случаи
    if (specialContentType === ACTIVITY_IDS.TODAY_TASKS) {
      return <TodayTasks />;
    }
    
    if (specialContentType === ACTIVITY_IDS.PROGRESS_CALENDAR) {
      return <ProgressCalendar />;
    }
    
    // Основной контент из маппинга активностей
    if (specialContentType && ACTIVITY_COMPONENTS[specialContentType]) {
      const ActivityComponent = ACTIVITY_COMPONENTS[specialContentType];
      
      if (specialContentType === ACTIVITY_IDS.WELCOME) {
        return <ActivityComponent />;
      }
      
      return (
        <ActivityWithBackButton>
          <ActivityComponent />
        </ActivityWithBackButton>
      );
    }
    
    // Рендеринг главы или дефолтного контента
    if (currentChapter) {
      const { id, content } = currentChapter;
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
    
    // Дефолтное сообщение
    return (
      <div className={styles.welcome}>
        <h2>Выберите главу для изучения</h2>
        <p>Здесь будет текст выбранной главы или задания.</p>
      </div>
    );
  };

  const contentId = getCurrentContentId();

  return (
    <>
      <UniversalTimer 
        componentId={contentId} 
        onTimeUpdate={currentChapter?.id ? handleChapterTimeUpdate : undefined}
      />
      {renderContent()}
    </>
  );
};

export default MainContent;
