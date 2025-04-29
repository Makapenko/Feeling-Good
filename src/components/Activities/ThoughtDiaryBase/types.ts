import { BaseExercise } from "../../../types/progress.types";

export interface Emotion {
  name: string;
  intensity: number;
}

export interface AutomaticThought {
  thought: string;
  cognitiveDistortions: string[];
  rationalResponse: string;
}

export interface ThoughtRecord {
  situation: string;
  emotions: Emotion[];
  automaticThoughts: AutomaticThought[];
  result: {
    emotions: Emotion[];
  };
} 

export interface ThoughtDiaryRecord {
  situation: string;
  emotions: Array<{ name: string; intensity: number }>;
  automaticThoughts: Array<{
    thought: string;
    cognitiveDistortions: string[];
    rationalResponse: string;
  }>;
  result: {
    emotions: Array<{ name: string; intensity: number }>;
  };
  timestamp: string;
  timeSpent?: number;
}

export interface ThoughtDiaryExercise extends BaseExercise {
  records: ThoughtDiaryRecord[];
}
