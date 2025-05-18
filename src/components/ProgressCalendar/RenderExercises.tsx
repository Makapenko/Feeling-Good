import React from "react";
import styles from "./DayDetails.module.css";
import { ACTIVITY_IDS } from "../../constants/activities";
import { Exercise } from '../../types/progress.types';
import { ThreeColumnsExercise } from '../Activities/ThreeColumnsBase/types';
import { ThoughtDiaryExercise } from '../Activities/ThoughtDiaryBase/types';
import { DailyScheduleExercise } from '../Activities/DailySchedule/types';
import { AntiProcrastinationExercise } from '../Activities/AntiProcrastinationSheet/types';
import { PleasureSheetExercise } from '../Activities/PleasureSheet/types';
import { NoButsExercise } from '../Activities/NoButsSheet/types';
import ThreeColumnsExerciseComponent from './render/ThreeColumnsExerciseComponent';
import ThoughtDiaryExerciseComponent from './render/ThoughtDiaryExerciseComponent';
import DailyScheduleExerciseComponent from './render/DailyScheduleExerciseComponent';
import AntiProcrastinationExerciseComponent from './render/AntiProcrastinationExerciseComponent';
import SmallStepsExerciseComponent from './render/SmallStepsExerciseComponent';
import SelfSupportExerciseComponent from './render/SelfSupportExerciseComponent';
import NoButsExerciseComponent from './render/NoButsExerciseComponent';
import MotivationWithoutCoercionExerciseComponent from './render/MotivationWithoutCoercionExerciseComponent';
import ImagineSuccessExerciseComponent from './render/ImagineSuccessExerciseComponent';
import PleasureSheetExerciseComponent from './render/PleasureSheetExerciseComponent';
import CheckCantDoExerciseComponent from './render/CheckCantDoExerciseComponent';
import CountAchievementsExerciseComponent from './render/CountAchievementsExerciseComponent'
import DownwardArrowExerciseComponent from './render/DownwardArrowExerciseComponent';
import DysfunctionalAttitudeScaleExerciseComponent from './render/DysfunctionalAttitudeScale/DysfunctionalAttitudeScaleExerciseComponent';
import { SelfSupportExercise } from '../Activities/SelfSupport/types';
import { MotivationWithoutCoercionExercise } from '../Activities/MotivationWithoutCoercion/types';
import { SmallStepsExercise } from '../Activities/SmallSteps/types';
import { CountAchievementsExercise } from '../Activities/CountAchievements/types';
import { ImagineSuccessExercise } from '../Activities/ImagineSuccess/types';
import { DownwardArrowExercise } from '../Activities/DownwardArrow/types';
import { CheckCantDoExercise } from '../Activities/CheckCantDo/types';
import { DysfunctionalAttitudeScaleExercise } from '../Activities/DysfunctionalAttitudeScale/types';
import ProcrastinationScaleExerciseComponent from './render/ProcrastinationScale/ProcrastinationScaleExerciseComponent';
import AngerProsConsExerciseComponent from './render/AngerProsConsExerciseComponent';
import { AngerProsConsExercise } from '../Activities/AngerProsCons/types';
import { useState } from "react";

interface TestResult {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
  completedAt: string;
  content?: string;
}

/**
 * Компонент для отображения и управления упражнениями пользователя
 * 
 * Отвечает за отображение списка упражнений различных типов,
 * управление их состоянием развернутости и группировкой некоторых специальных типов упражнений.
 */
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
        case ACTIVITY_IDS.PROCRASTINATION_SCALE:
          return <ProcrastinationScaleExerciseComponent
            key={exercise.id}
            exercise={{
              id: exercise.id,
              type: exercise.type,
              name: exercise.name,
              date: exercise.completedAt,
              completedAt: exercise.completedAt,
              score: 'score' in exercise ? Number(exercise.score) : 0,
              maxScore: 'maxScore' in exercise ? Number(exercise.maxScore) : 45
            }}
            expandedExercises={expandedExercises}
            toggleExercise={toggleExercise}
          />;
        case ACTIVITY_IDS.ANGER_PROS_CONS:
          return <AngerProsConsExerciseComponent
            key={exercise.id}
            exercises={[exercise as AngerProsConsExercise]}
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
