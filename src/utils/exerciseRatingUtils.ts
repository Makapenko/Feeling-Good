import { ActivityId } from '../constants/activities';
import { RootState } from '../redux/types';
import { Exercise } from '../types/progress.types';

/**
 * Получает последнее упражнение определенного типа из всех дневных записей
 */
export const getLatestExerciseId = (
  state: RootState,
  activityId: ActivityId
): string | null => {
  const dailyProgress = state.progress.dailyProgress;

  let latestId: string | null = null;
  let latestDate: string | null = null;

  // Проходим по всем дням
  for (const dayProgress of Object.values(dailyProgress)) {
    if (!dayProgress?.exercises?.exercises) continue;

    const exercises: Exercise[] = dayProgress.exercises.exercises;

    // Проверяем упражнения в этом дне
    for (const exercise of exercises) {
      if (exercise.type === activityId) {
        if (!latestDate || exercise.completedAt > latestDate) {
          latestId = exercise.id;
          latestDate = exercise.completedAt;
        }
      }
    }
  }

  return latestId;
};

/**
 * Получает средний рейтинг для определенного типа активности
 */
export const getAverageRatingForActivity = (
  state: RootState,
  activityId: ActivityId
): number | null => {
  const ratings = state.progress.exerciseRatings?.filter(
    r => r.activityId === activityId
  ) || [];

  if (ratings.length === 0) return null;

  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Округляем до 1 знака
};

/**
 * Получает рейтинг для конкретного упражнения
 */
export const getRatingForExercise = (
  state: RootState,
  exerciseId: string
): number | null => {
  const rating = state.progress.exerciseRatings?.find(
    r => r.exerciseId === exerciseId
  );

  return rating?.rating || null;
};

/**
 * Проверяет, был ли оценен конкретное упражнение
 */
export const isExerciseRated = (
  state: RootState,
  exerciseId: string
): boolean => {
  return state.progress.exerciseRatings?.some(
    r => r.exerciseId === exerciseId
  ) || false;
};
