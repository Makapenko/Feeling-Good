import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './types';
import { useMemo } from 'react';
import {
  selectProgress,
  selectCurrentChapter,
  selectSpecialContent,
  selectDailyProgress,
  selectChapters,
  selectUnlockedContent,
  selectCompletedChapters,
  selectFavoriteActivities,
  selectLastUnlockedChapter,
  selectLastUnlockedActivities,
  selectTodayProgress,
  selectTodayExercises,
  selectTodayTests,
  selectExercisesByType,
  selectTestsByType,
  selectIsChapterAvailable,
  selectIsActivityAvailable,
  selectIsFavoriteActivity,
  selectTimeSpentByChapter,
  selectTimeSpentByActivity,
  selectTodayActivitiesProgress,
  selectNotifications,
  selectFavoriteChapters
} from './selectors';
import { SpecialContent } from '../types/progress.types';

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Хуки с селекторами для удобного использования
export const useProgressSelector = () => useAppSelector(selectProgress);
export const useCurrentChapter = () => useAppSelector(selectCurrentChapter);
export const useSpecialContent = () => useAppSelector(selectSpecialContent);
export const useDailyProgress = () => useAppSelector(selectDailyProgress);
export const useChapters = () => useAppSelector(selectChapters);
export const useUnlockedContent = () => useAppSelector(selectUnlockedContent);
export const useCompletedChapters = () => useAppSelector(selectCompletedChapters);
export const useFavoriteActivities = () => useAppSelector(selectFavoriteActivities);
export const useLastUnlockedChapter = () => useAppSelector(selectLastUnlockedChapter);
export const useLastUnlockedActivities = () => useAppSelector(selectLastUnlockedActivities);
export const useNotifications = () => useAppSelector(selectNotifications);

// Хук для получения активной вкладки мобильного интерфейса
export const useActiveTab = () => useAppSelector(state => state.mobile.activeTab);

// Мемоизированные селекторы с параметрами
export const useTodayProgress = () => useAppSelector(selectTodayProgress);
export const useTodayExercises = () => useAppSelector(selectTodayExercises);
export const useTodayTests = () => useAppSelector(selectTodayTests);

export const useExercisesByType = (exerciseType: string) => {
  const selector = useMemo(() => selectExercisesByType(exerciseType), [exerciseType]);
  return useAppSelector(selector);
};

export const useTestsByType = (testType: string) => {
  const selector = useMemo(() => selectTestsByType(testType), [testType]);
  return useAppSelector(selector);
};

export const useIsChapterAvailable = (chapterId: string) => {
  const selector = useMemo(() => selectIsChapterAvailable(chapterId), [chapterId]);
  return useAppSelector(selector);
};

export const useIsActivityAvailable = (activityId: SpecialContent) => {
  const selector = useMemo(() => selectIsActivityAvailable(activityId), [activityId]);
  return useAppSelector(selector);
};

export const useIsFavoriteActivity = (activityId: SpecialContent) => {
  const selector = useMemo(() => selectIsFavoriteActivity(activityId), [activityId]);
  return useAppSelector(selector);
};

export const useTimeSpentByChapter = () => useAppSelector(selectTimeSpentByChapter);

// Хук для получения времени, потраченного на активности
export const useTimeSpentByActivity = () => useAppSelector(selectTimeSpentByActivity);

// Хук для получения прогресса активностей за сегодня
export const useTodayActivitiesProgress = () => useAppSelector(selectTodayActivitiesProgress);

// Хук для получения избранных глав
export const useFavoriteChapters = () => useAppSelector(selectFavoriteChapters);

// Хук для проверки, находится ли глава в избранном
export const useIsFavoriteChapter = (chapterId: string) => {
  const favoriteChapters = useAppSelector(selectFavoriteChapters);
  return favoriteChapters.some(chapter => chapter.id === chapterId);
};

// Использование всей истории чтения
export const useAllReadingHistory = () => {
  return useAppSelector((state) => state.progress.readingHistory);
}; 
