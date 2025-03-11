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
