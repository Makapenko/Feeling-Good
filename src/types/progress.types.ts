import { DailyScheduleExercise } from '../components/Activities/DailySchedule/types';
import { ThoughtDiaryExercise } from '../components/Activities/ThoughtDiary/types';
import { SmallStepsExercise } from '../components/Activities/SmallSteps/types';
import { ActivityId } from '../constants/activities';
import { ThreeColumnsExercise } from '../components/Activities/ThreeColumnsBase/types';
import { AntiProcrastinationExercise } from '../components/Activities/AntiProcrastinationSheet/types';
import { PleasureSheetExercise } from '../components/Activities/PleasureSheet/types';
import { NoButsExercise } from '../components/Activities/NoButsSheet/types';
import { SelfSupportExercise } from '../components/Activities/SelfSupport/types';
import { MotivationWithoutCoercionExercise } from '../components/Activities/MotivationWithoutCoercion/types';
import { ImagineSuccessExercise } from '../components/Activities/ImagineSuccess/types';
import { CountAchievementsExercise } from '../components/Activities/CountAchievements/types';
import { CheckCantDoExercise } from '../components/Activities/CheckCantDo/types';
import { NoLoseTechniqueExercise } from '../components/Activities/NoLoseTechnique/types';
import { DownwardArrowExercise } from '../components/Activities/DownwardArrow/types';
import { RewriteBeliefExercise } from '../components/Activities/RewriteBelief/types';
import { DysfunctionalAttitudeScaleExercise } from '../components/Activities/DysfunctionalAttitudeScale/types';


/**
 * Базовый интерфейс для всех упражнений.
 * Содержит общие поля, присутствующие во всех типах упражнений.
 */
export interface BaseExercise {
  type: ActivityId;  // ID типа активности (упражнения)
  id: string;        // Уникальный идентификатор конкретного экземпляра упражнения
  name: string;      // Имя упражнения, вычисляемое из type через ACTIVITY_NAMES
  completed: boolean;
  completedAt: string;
}

export type Exercise = ThreeColumnsExercise | ThoughtDiaryExercise | DailyScheduleExercise | 
  AntiProcrastinationExercise | PleasureSheetExercise | NoButsExercise | SelfSupportExercise | 
  SmallStepsExercise | MotivationWithoutCoercionExercise | ImagineSuccessExercise | CountAchievementsExercise |
  CheckCantDoExercise | NoLoseTechniqueExercise | DownwardArrowExercise | DysfunctionalAttitudeScaleExercise | RewriteBeliefExercise;

export type SpecialContent = ActivityId;
