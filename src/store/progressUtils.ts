import { UserProgress } from '../types/progress.types';

export const STORAGE_KEY = 'feeling_good_progress';

export function getInitialState(): UserProgress {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    try {
      return JSON.parse(savedProgress);
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
          testResults: []
        }
      }
    },
    chapters: [],
    
  };
}

export function getInitialProgress(): UserProgress {
  const savedProgress = localStorage.getItem('userProgress');
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }

  return {
    currentChapter: null,
    specialContent: null,
    dailyProgress: {},
    chapters: [],
  };
} 
