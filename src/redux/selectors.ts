import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './types';
import { getCurrentDate } from '../utils/dateUtils';
import { SpecialContent, Exercise } from '../types/progress.types';
import { TestResult } from './types';

// Базовые селекторы
export const selectProgress = (state: RootState) => state.progress;
export const selectCurrentChapter = (state: RootState) => state.progress.currentChapter;
export const selectSpecialContent = (state: RootState) => state.progress.specialContent;
export const selectDailyProgress = (state: RootState) => state.progress.dailyProgress;
export const selectChapters = (state: RootState) => state.progress.chapters;
export const selectUnlockedContent = (state: RootState) => state.progress.unlockedContent;
export const selectCompletedChapters = (state: RootState) => state.progress.completedChapters;
export const selectFavoriteActivities = (state: RootState) => state.progress.favoriteActivities;
export const selectLastUnlockedChapter = (state: RootState) => state.progress.lastUnlockedChapter;
export const selectLastUnlockedActivities = (state: RootState) => state.progress.lastUnlockedActivities;

// Селекторы для мобильного состояния
export const selectMobileActiveTab = (state: RootState) => state.mobile.activeTab;

// Селекторы для уведомлений
export const selectNotifications = (state: RootState) => state.notification.notifications;

// Селектор для избранных глав
export const selectFavoriteChapters = (state: RootState) => state.progress.favoriteChapters || [];

// Мемоизированные селекторы для оптимизации
export const selectTodayProgress = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const today = getCurrentDate();
    return dailyProgress[today] || null;
  }
);

export const selectTodayExercises = createSelector(
  [selectTodayProgress],
  (todayProgress) => {
    return todayProgress?.exercises.exercises || [];
  }
);

export const selectTodayTests = createSelector(
  [selectTodayProgress],
  (todayProgress) => {
    return todayProgress?.exercises.testResults || [];
  }
);

export const selectExercisesByType = (exerciseType: string) => 
  createSelector(
    [selectDailyProgress],
    (dailyProgress) => {
      const allExercises: Exercise[] = [];
      
      // Собираем все упражнения указанного типа из всех дней
      Object.values(dailyProgress).forEach(dayProgress => {
        if (dayProgress.exercises && dayProgress.exercises.exercises) {
          const filtered = dayProgress.exercises.exercises.filter(
            exercise => exercise.type === exerciseType
          );
          allExercises.push(...filtered);
        }
      });
      
      return allExercises;
    }
  );

export const selectTestsByType = (testType: string) => 
  createSelector(
    [selectDailyProgress],
    (dailyProgress) => {
      const allTests: TestResult[] = [];
      
      // Собираем все тесты указанного типа из всех дней
      Object.values(dailyProgress).forEach(dayProgress => {
        if (dayProgress.exercises && dayProgress.exercises.testResults) {
          const filtered = dayProgress.exercises.testResults.filter(
            test => test.id === testType
          );
          allTests.push(...filtered);
        }
      });
      
      return allTests.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    }
  );

export const selectIsChapterAvailable = (chapterId: string) => 
  createSelector(
    [selectUnlockedContent],
    (unlockedContent) => {
      if (unlockedContent?.chapters?.includes('all')) {
        return true;
      }
      return unlockedContent?.chapters?.includes(chapterId) ?? false;
    }
  );

export const selectIsActivityAvailable = (activityId: SpecialContent) => 
  createSelector(
    [selectUnlockedContent],
    (unlockedContent) => {
      if (unlockedContent?.chapters?.includes('all')) {
        return true;
      }
      return unlockedContent?.activities?.includes(activityId) ?? false;
    }
  );

export const selectIsFavoriteActivity = (activityId: SpecialContent) => 
  createSelector(
    [selectFavoriteActivities],
    (favoriteActivities) => {
      return favoriteActivities?.includes(activityId) ?? false;
    }
  );

export const selectTimeSpentByChapter = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const result: Record<string, number> = {};
    
    // Собираем время, потраченное на каждую главу
    Object.values(dailyProgress).forEach(dayProgress => {
      Object.entries(dayProgress.chapters || {}).forEach(([chapterId, chapterProgress]) => {
        if (!result[chapterId]) {
          result[chapterId] = 0;
        }
        result[chapterId] += chapterProgress.timeSpent || 0;
      });
    });
    
    return result;
  }
);

// Селектор для получения времени, проведенного в активностях
export const selectTimeSpentByActivity = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const result: Record<string, number> = {};
    
    // Собираем время, потраченное на каждую активность
    Object.values(dailyProgress).forEach(dayProgress => {
      if (dayProgress.activities) {
        Object.entries(dayProgress.activities).forEach(([activityId, activityProgress]) => {
          if (!result[activityId]) {
            result[activityId] = 0;
          }
          result[activityId] += activityProgress.timeSpent || 0;
        });
      }
    });
    
    return result;
  }
);

// Селектор для получения времени активностей за текущий день
export const selectTodayActivitiesProgress = createSelector(
  [selectTodayProgress],
  (todayProgress) => {
    const activities = todayProgress?.activities || {};
    console.log('Redux селектор: активности за сегодня:', activities);
    return activities;
  }
); 
