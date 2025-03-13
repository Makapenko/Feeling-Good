export interface ThoughtRecord {
  id: string;
  leftColumn: string;
  cognitiveDistortion: string[];
  rightColumn: string;
  timestamp: string;
}

export interface ThreeColumnsMethodResult {
  id: string;
  name: string;
  completed: boolean;
  completedAt: string;
  records: ThoughtRecord[];
} 
