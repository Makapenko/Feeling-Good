export interface Task {
  id: string;
  text: string;
  expectedDifficulty: number;
  expectedPleasure: number;
  actualDifficulty: number | null;
  actualPleasure: number | null;
  completed: boolean;
}

export interface TaskStep {
  id: string;
  text: string;
  isCompleted: boolean;
} 
