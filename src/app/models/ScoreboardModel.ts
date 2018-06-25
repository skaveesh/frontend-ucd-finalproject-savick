export interface Score {
  name: string;
  startBalance: number;
  endBalance: number;
  profit: number;
}

export interface ScoreboardModel {
  score: Score[];
}
