export interface Score {
  name: string;
  startBalance: number;
  endBalance: number;
  profit: number;
}

export interface Scoreboard {
  score: Score[];
}
