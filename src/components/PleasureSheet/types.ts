export interface Activity {
  id: string;
  date: string;
  text: string;
  participants: string;
  expectedPleasure: number;
  actualPleasure: number | null;
} 
