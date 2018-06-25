export interface Player {
  name: string;
  startBalance: number;
}

export interface Turn {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn1 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn2 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn3 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn4 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn5 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn6 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn7 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn8 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn9 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface Turn10 {
  name: string;
  sellOrBuy: string;
  stock: string;
  quantity: number;
  stockPrice: number;
}

export interface GameStatusModel {
  isGameReadyToStart: boolean;
  isGameStarted: boolean;
  gameStartTurn: number;
  gameLocalCurrentTurn: number;
  timeToStartTheGameInSec: number;
  players: Player[];
  turn1: Turn1[];
  turn2: Turn2[];
  turn3: Turn3[];
  turn4: Turn4[];
  turn5: Turn5[];
  turn6: Turn6[];
  turn7: Turn7[];
  turn8: Turn8[];
  turn9: Turn9[];
  turn10: Turn10[];
}
