export interface Question {
  text: string;
}

export interface Part {
  title: string;
  questions: Question[];
}

export interface SurveyConfig {
  id?: string;
  title: string;
  parts: {
    title: string;
    questions: {
      text: string;
    }[];
  }[];
  answers: {
    label: string;
    value: number;
  }[];
  results: {
    minScore: number;
    maxScore: number;
    description: string;
  }[];
}

export interface Answer {
  value: number;
  label: string;
}

export interface Result {
  minScore: number;
  maxScore: number;
  description: string;
}

export interface SurveyState {
  score: number;
  answers: {
    [questionIndex: number]: number;
  };
}

export interface SurveyResult {
  id: string;
  name: string;
  score: number;
  maxScore?: number;
  completedAt: string;
  completed: boolean;
} 
