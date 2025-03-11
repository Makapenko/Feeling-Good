export interface Activity {
  text: string;
  type: {
    isTask: boolean;
    isPleasure: boolean;
  };
  ratings: {
    task: number | null;
    pleasure: number | null;
  };
}

export interface TimeSlot {
  time: string;
  planned: Activity | null;
  actual: Activity | null;
} 
