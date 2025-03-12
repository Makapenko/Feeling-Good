import { Exercise } from '../../types/progress.types';

export interface ChapterMap {
  [key: string]: {
    id: string;
    title: string;
    order: number;
    sections: { id: string; title: string }[];
  };
}

export interface CalendarDayProgress {
  date: string;
  chapters?: {
    id: string;
    title: string;
    timeSpent: number;
    parentChapter?: {
      id: string;
      title: string;
      order: number;
    };
  }[];
  exercises: {
    testResults?: {
      id: string;
      name: string;
      completed: boolean;
      score?: number;
      maxScore?: number;
      completedAt: string;
    }[];
    exercises?: Exercise[];
  };
}
