export interface ButPair {
  id: string;
  but: string;
  noBut: string;
  timestamp: string;
}

export interface NoButsData {
  date: string;
  pairs: ButPair[];
} 
