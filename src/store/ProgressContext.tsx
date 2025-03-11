import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { UserProgress, Chapter, SpecialContent } from '../types/progress.types';
import { progressReducer, ProgressAction } from './progressReducer';
import { STORAGE_KEY, getInitialState } from './progressUtils';

interface ProgressContextType {
  progress: UserProgress;
  dispatch: React.Dispatch<ProgressAction>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, dispatch] = useReducer(progressReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  return (
    <ProgressContext.Provider value={{ progress, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export type { Chapter, SpecialContent }; 
