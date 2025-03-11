export interface Question {
  text: string;
}

export interface Part {
  title: string;
  questions: Question[];
}

export interface SurveyConfig {
  title: string;
  parts: Part[];
  answers: Answer[];
  results: Result[];
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
  answers: { [key: number]: number };
} 
