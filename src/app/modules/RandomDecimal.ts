export interface Random {
  data: number[];
  completionTime: string;
}

export interface Result {
  random: Random;
  bitsUsed: number;
  bitsLeft: number;
  requestsLeft: number;
  advisoryDelay: number;
}

export interface RandomDecimal{
  jsonrpc: string;
  result: Result;
  id: number;
}
