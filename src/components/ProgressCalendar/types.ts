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
  chapters: {
    id: string;
    title: string;
    timeSpent: number;
    parentChapter?: {
      id: string;
      title: string;
      order: number;
    };
  }[];
  tests?: {
    type: string;
    result: number;
    title: string;
  }[];
} 
