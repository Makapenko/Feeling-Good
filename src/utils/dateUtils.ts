import { UserProgress } from '../types/progress.types';

export const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const getInitialUserProgress = (): UserProgress => ({
  dailyProgress: {},
  statistics: {
    totalTimeSpent: 0,
    chaptersCompleted: 0,
    exercisesCompleted: 0,
    testsCompleted: 0,
    averageTestScore: 0,
    streakDays: 0,
    lastActiveDate: getCurrentDate()
  },
  settings: {
    theme: 'light' as const,
    fontSize: 'medium' as const
  },
  completedChapters: []
}); 
