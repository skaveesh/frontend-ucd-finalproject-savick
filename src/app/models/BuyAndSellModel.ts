export interface StockAndUserDetails {
  name: string;
  stock: string;
  quantity: number;
  price: number;
}

export interface Buy {
  stockAndUserDetails: StockAndUserDetails;
}

export interface BuyObjectRoot {
  buy: Buy;
}

export interface Sell {
  stockAndUserDetails: StockAndUserDetails;
}

export interface SellObjectRoot {
  sell: Sell;
}
