export interface OwnStockList {
  stock: string;
  quantity: number;
}

export interface BroughtStockList {
  stock: string;
  quantity: number;
  price: number;
  turn: number;
}

export interface SoldStockList {
  stock: string;
  quantity: number;
  price: number;
  turn: number;
}

export interface Portfolio {
  name: string;
  ownStockList: OwnStockList[];
  broughtStockList: BroughtStockList[];
  soldStockList: SoldStockList[];
}

export interface PortfolioModel {
  portfolio: Portfolio;
}
