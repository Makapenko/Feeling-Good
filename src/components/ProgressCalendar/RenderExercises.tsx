import { useState } from "react";
import styles from "./DayDetails.module.css";

import { ACTIVITY_IDS } from "../../constants/activities";
import { Exercise } from '../../types/progress.types';

import { ThreeColumnsExercise } from '../Activities/ThreeColumnsBase/types';
import ThreeColumnsExerciseComponent from './render/ThreeColumnsExerciseComponent';

import { ThoughtDiaryExercise } from '../Activities/ThoughtDiaryBase/types';
import ThoughtDiaryExerciseComponent from './render/ThoughtDiaryExerciseComponent';

import { DailyScheduleExercise } from '../Activities/DailySchedule/types';
import DailyScheduleExerciseComponent from './render/DailyScheduleExerciseComponent';

import { AntiProcrastinationExercise } from '../Activities/AntiProcrastinationSheet/types';
import AntiProcrastinationExerciseComponent from './render/AntiProcrastinationExerciseComponent';

import { PleasureSheetExercise } from '../Activities/PleasureSheet/types';
import PleasureSheetExerciseComponent from './render/PleasureSheetExerciseComponent';

import { NoButsExercise } from '../Activities/NoButsSheet/types';
import NoButsExerciseComponent from './render/NoButsExerciseComponent';

import SmallStepsExerciseComponent from './render/SmallStepsExerciseComponent';
import { SmallStepsExercise } from '../Activities/SmallSteps/types';

import SelfSupportExerciseComponent from './render/SelfSupportExerciseComponent';
import { SelfSupportExercise } from '../Activities/SelfSupport/types';

import MotivationWithoutCoercionExerciseComponent from './render/MotivationWithoutCoercionExerciseComponent';
import { MotivationWithoutCoercionExercise } from '../Activities/MotivationWithoutCoercion/types';

import ImagineSuccessExerciseComponent from './render/ImagineSuccessExerciseComponent';
import { ImagineSuccessExercise } from '../Activities/ImagineSuccess/types';

import CheckCantDoExerciseComponent from './render/CheckCantDoExerciseComponent';
import { CheckCantDoExercise } from '../Activities/CheckCantDo/types';

import CountAchievementsExerciseComponent from './render/CountAchievementsExerciseComponent';
import { CountAchievementsExercise } from '../Activities/CountAchievements/types';

import DownwardArrowExerciseComponent from './render/DownwardArrowExerciseComponent';
import { DownwardArrowExercise } from '../Activities/DownwardArrow/types';

import DysfunctionalAttitudeScaleExerciseComponent from './render/DysfunctionalAttitudeScale/DysfunctionalAttitudeScaleExerciseComponent';
import { DysfunctionalAttitudeScaleExercise } from '../Activities/DysfunctionalAttitudeScale/types';

import AngerProsConsExerciseComponent from './render/AngerProsConsExerciseComponent';
import { AngerProsConsExercise } from '../Activities/AngerProsCons/types';

import RewriteBeliefExerciseComponent from './render/RewriteBeliefExerciseComponent';
import { RewriteBeliefExercise } from '../Activities/RewriteBelief/types';

import UniversalCounterExerciseComponent from './render/UniversalCounterExerciseComponent';
import { UniversalCounterExercise } from '../Activities/UniversalCounter/types';

import IntimacyScaleExerciseComponent from './render/IntimacyScaleExerciseComponent';
import { IntimacyScaleExercise } from '../Activities/IntimacyScale/types';

/**
 * Компонент для отображения и управления упражнениями пользователя
 * 
 * Отвечает за отображение списка упражнений различных типов,
 * управление их состоянием развернутости и группировкой некоторых специальных типов упражнений.
 */
interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string;
  content?: string;
}

interface RenderExercisesProps {
  exercises: {
    exercises?: Exercise[];
    testResults?: TestResult[];
  };
  onClose: () => void;
}

const RenderExercises: React.FC<RenderExercisesProps> = ({ exercises, onClose }) => {
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  
  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const renderExercises = (exerciseList: Exercise[]) => {
    return exerciseList.map((exercise) => {
      switch (exercise.type) {
        case ACTIVITY_IDS.THREE_COLUMNS_METHOD:
        case ACTIVITY_IDS.HINDERING_HELPING_THOUGHTS:
        case ACTIVITY_IDS.HOT_COOL_THOUGHTS:
        case ACTIVITY_IDS.REWRITE_SHOULD_RULES:
        case ACTIVITY_IDS.RATIONAL_RESPONSES:
        case ACTIVITY_IDS.ADVANTAGES_DISADVANTAGES:
        case ACTIVITY_IDS.NO_LOSE_TECHNIQUE:
        case ACTIVITY_IDS.VERBAL_JUDO:
        case ACTIVITY_IDS.REASONS_SHOULD_REFUTATION:
        case ACTIVITY_IDS.REJECTION_RESPONSE:
        case ACTIVITY_IDS.MOOD_JOURNAL:
        case ACTIVITY_IDS.LOVE_ADDICTION_DISADVANTAGES:
        case ACTIVITY_IDS.BELIEF_CORRECTION:
        case ACTIVITY_IDS.SELF_CRITICISM_RESPONSE:
          return <ThreeColumnsExerciseComponent
            key={exercise.id}
            exercise={exercise as ThreeColumnsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.THOUGHT_DIARY:
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.IMAGERY_SCENES_DIARY:
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
            customTitle="Дневник воображаемых сцен"
            showCognitiveDistortions={false}
          />;
        case ACTIVITY_IDS.PROCRASTINATION_DIARY:
          return <ThoughtDiaryExerciseComponent
            key={exercise.id}
            exercise={exercise as ThoughtDiaryExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
            customTitle="Дневник прокрастинации"
            showCognitiveDistortions={false}
            showEmotionIntensity={false}
            showResultIntensity={false}
          />;
        case ACTIVITY_IDS.DAILY_SCHEDULE:
          return <DailyScheduleExerciseComponent
            key={exercise.id}
            exercise={exercise as DailyScheduleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.ANTI_PROCRASTINATION:
          return <AntiProcrastinationExerciseComponent
            key={exercise.id}
            exercise={exercise as AntiProcrastinationExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.PLEASURE_SHEET:
        case ACTIVITY_IDS.LONELINESS_PLEASURE_SHEET:
          return <PleasureSheetExerciseComponent
            key={exercise.id}
            exercise={exercise as PleasureSheetExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.NO_BUTS:
          return <NoButsExerciseComponent
            key={exercise.id}
            exercise={exercise as NoButsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.SELF_SUPPORT:
          return <SelfSupportExerciseComponent
            key={exercise.id}
            exercise={exercise as SelfSupportExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.SMALL_STEPS:
          return <SmallStepsExerciseComponent
            key={exercise.id}
            exercise={exercise as SmallStepsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.MOTIVATION_WITHOUT_COERCION:
          return <MotivationWithoutCoercionExerciseComponent
            key={exercise.id}
            exercise={exercise as MotivationWithoutCoercionExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.IMAGINE_SUCCESS:
          return <ImagineSuccessExerciseComponent
            key={exercise.id}
            exercise={exercise as ImagineSuccessExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.COUNT_ACHIEVEMENTS:
          return <CountAchievementsExerciseComponent
            key={exercise.id}
            exercise={exercise as CountAchievementsExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.CHECK_CANT_DO:
          return <CheckCantDoExerciseComponent
            key={exercise.id}
            exercise={exercise as CheckCantDoExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.DOWNWARD_ARROW:
          return <DownwardArrowExerciseComponent
            key={exercise.id}
            exercise={exercise as DownwardArrowExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.DYSFUNCTIONAL_ATTITUDE_SCALE:
          return <DysfunctionalAttitudeScaleExerciseComponent
            key={exercise.id}
            exercise={exercise as DysfunctionalAttitudeScaleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case ACTIVITY_IDS.INTIMACY_SCALE:
          return <IntimacyScaleExerciseComponent
            key={exercise.id}
            exercise={exercise as IntimacyScaleExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.ANGER_PROS_CONS:
          return <AngerProsConsExerciseComponent
            key={exercise.id}
            exercises={[exercise as AngerProsConsExercise]}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.REWRITE_BELIEF:
          return <RewriteBeliefExerciseComponent
            key={exercise.id}
            exercise={exercise as RewriteBeliefExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        case ACTIVITY_IDS.NEGATIVE_THOUGHTS_COUNTER:
        case ACTIVITY_IDS.SHOULD_COUNTER:
        case ACTIVITY_IDS.INNER_LIGHT:
        case ACTIVITY_IDS.DONE_RIGHT_COUNTER:
          return <UniversalCounterExerciseComponent
            key={exercise.id}
            exercise={exercise as UniversalCounterExercise}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
            onClose={onClose}
          />;
        default:
          return null;
      }
    });
  };

  // Если нет упражнений, показываем пустое состояние
  if (!exercises.exercises || exercises.exercises.length === 0) {
    return <div className={styles.emptyState}>Нет выполненных упражнений за этот день</div>;
  }

  // Группируем упражнения преимуществ и недостатков гнева
  const angerProsConsExercises = exercises.exercises.filter(
    ex => ex.type === ACTIVITY_IDS.ANGER_PROS_CONS
  ) as AngerProsConsExercise[];
  
  // Остальные упражнения
  const otherExercises = exercises.exercises.filter(
    ex => ex.type !== ACTIVITY_IDS.ANGER_PROS_CONS
  );

  return (
    <>
      {angerProsConsExercises.length > 0 && (
        <AngerProsConsExerciseComponent
          key="anger-pros-cons-group"
          exercises={angerProsConsExercises}
          expandedExercises={expandedExercises}
          toggleExercise={toggleExercise}
          onClose={onClose}
        />
      )}
      {renderExercises(otherExercises)}
    </>
  );
};

export default RenderExercises;
