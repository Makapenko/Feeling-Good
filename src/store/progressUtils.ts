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
  
  return {
    currentChapter: null,
    specialContent: null,
    dailyProgress: {}
  };
} 
