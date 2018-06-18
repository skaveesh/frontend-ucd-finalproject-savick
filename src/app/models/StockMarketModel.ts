export interface Stock {
  companyName: string;
  stock: string;
  price: number[];
}

export interface Sector {
  sectorName: string;
  stocks: Stock[];
}

export interface StockMarketModel {
  market: Sector[];
}
