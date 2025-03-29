export interface ThoughtItem {
  id: string;
  text: string;
  question?: string;
  rationalResponse: string;
}

export interface DownwardArrowChain {
  id: string;
  initialThought: string;
  initialRationalResponse: string;
  chainItems: ThoughtItem[];
  hiddenBeliefs: string;
  timestamp: string;
}

export interface DownwardArrowExercise {
  id: string;
  type: string;
  name: string;
  completed: boolean;
  completedAt: string;
  chains: DownwardArrowChain[];
} 
