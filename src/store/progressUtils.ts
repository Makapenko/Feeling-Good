import { UserProgress } from '../types/progress.types';

export const STORAGE_KEY = 'feeling_good_progress';

export function getInitialState(): UserProgress {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      // Убедимся, что все необходимые поля существуют
      return {
        ...parsed,
        unlockedContent: parsed.unlockedContent || {
          chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
          activities: []
        },
        completedChapters: parsed.completedChapters || [],
        favoriteActivities: parsed.favoriteActivities || []
      };
    } catch (e) {
      console.error('Error parsing saved progress:', e);
    }
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return {
    currentChapter: null,
    specialContent: null,
    dailyProgress: {
      [today]: {
        chapters: {},
        exercises: {
          testResults: [],
          exercises: []
        }
      }
    },
    chapters: [],
    unlockedContent: {
      chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
      activities: []
    },
    completedChapters: [],
    favoriteActivities: []
  };
}

export function getInitialProgress(): UserProgress {
  const savedProgress = localStorage.getItem('userProgress');
  if (savedProgress) {
    const parsed = JSON.parse(savedProgress);
    return {
      ...parsed,
      unlockedContent: parsed.unlockedContent || {
        chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
        activities: []
      },
      favoriteActivities: parsed.favoriteActivities || []
    };
  }

  return {
    currentChapter: null,
    specialContent: null,
    dailyProgress: {},
    chapters: [],
    unlockedContent: {
      chapters: ['acknowledgments', 'foreword', 'introduction', 'ch1'],
      activities: []
    },
    completedChapters: [],
    favoriteActivities: []
  };
} 
