export interface RandomDecimalRequest {
  jsonrpc: string;
  method: string;
  params: Params;
  id: number;
}
export interface Params {
  apiKey: string;
  n: number;
  decimalPlaces: number;
  replacement: boolean;
}
