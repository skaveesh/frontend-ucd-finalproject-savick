import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import "rxjs/Rx"
import {Authorization, PlayerLoginModel} from "../models/PlayerLoginModel";
import {CreatePlayerAccountForName, PlayerCreateModel} from "../models/PlayerCreateModel";
import {Observable} from "rxjs/Observable";
import {StockMarketModel} from "../models/StockMarketModel";
import {BooleanValueModel} from "../models/BooleanValueModel";
import {CreateBrokerAccountModel, CreateBrokerAccountFromName} from "../models/CreateBrokerAccountModel";
import {CreateBankAccountModel, CreateBankAccountFromName} from "../models/CreateBankAccountModel";
import {PortfolioModel} from "../models/PortfolioModel";
import {ProfileModel} from "../models/ProfileModel";
import {GameStatusModel} from "../models/GameStatusModel";
import {AnalyserRecommendationsModel} from "../models/AnalyserRecommendationsModel";
import {BankBalanceModel} from "../models/BankBalanceModel";
import {Buy, BuyObjectRoot, Sell, SellObjectRoot, StockAndUserDetails} from "../models/BuyAndSellModel";
import {ScoreboardModel} from "../models/ScoreboardModel";
import {RankingModel} from "../models/RankingModel";

@Injectable({
  providedIn: 'root'
})
export class HttprequestService {
  readonly ROOT_URL = 'http://localhost:5000/';

  //readonly ROOT_URL = 'https://aws.amazon.bla.bla.bla:500/';

  constructor(private http: HttpClient) {
  }

  readonly jsonHeader = new HttpHeaders(
    {
      'Content-Type': 'application/json'
    });

  /**
   * create player account
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Response>}
   */
  createPlayer(username: string, password: string): Promise<Response> {
    const create_account_url = this.ROOT_URL + "player/createaccount";

    let createAccount: CreatePlayerAccountForName = {
      username: username,
      password: password
    };

    let userAccountCreateData: PlayerCreateModel = {
      createPlayerAccountForName: createAccount
    };

    return this.http.post(create_account_url, userAccountCreateData, {
      headers: this.jsonHeader,
      observe: 'response'
    }).toPromise().then(this.extractData).catch(this.handleErrorPromise);
  }

  /**
   * player login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Response>}
   */
  loginPlayer(username: string, password: string): Promise<Response> {
    const login_url = this.ROOT_URL + "player/login";

    let authorization: Authorization = {
      username: username,
      password: password
    };

    let userLoginData: PlayerLoginModel = {
      authorization: authorization
    };

    return this.http.post(login_url, userLoginData, {
      headers: this.jsonHeader,
      observe: 'response'
    }).toPromise().then(this.extractData).catch(this.handleErrorPromise);
  }

  /**
   * get stock market all values
   * @returns {Observable<StockMarketModel>}
   */
  getStockMarket(): Observable<StockMarketModel> {
    const get_stock_market_url = this.ROOT_URL + "broker/stock/getall";

    return this.http.post(get_stock_market_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * check if logged user has a bank account
   * @returns {Observable<BooleanValueModel>}
   */
  checkExistenceOfBankAccount(username: string): Promise<BooleanValueModel> {
    const get_bank_existence_url = this.ROOT_URL + "bank/account/check/" + username;

    return this.http.post(get_bank_existence_url, null, {
      headers: this.jsonHeader
    }).toPromise().then(this.extractData).catch(this.handleErrorPromise);
  }

  /**
   * create bank account for the player
   * @param {string} username
   * @returns {Observable<any>}
   */
  createBankAccount(username: string) {
    const create_broker_account_url = this.ROOT_URL + "bank/account/createaccount";

    let createBankAccountFromName: CreateBankAccountFromName = {
      name: username
    };

    let createBankAccount: CreateBankAccountModel = {
      createBankAccountFromName: createBankAccountFromName
    };

    return this.http.post(create_broker_account_url, createBankAccount, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }


  /**
   * get player profile of the bank with all the transactions
   * @param {string} username
   * @returns {Observable<ProfileModel>}
   */
  getProfileFromBank(username: string): Observable<ProfileModel> {
    const get_profile_url = this.ROOT_URL + "bank/account/profile/" + username;

    return this.http.post(get_profile_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * get user bank account balance
   * @param {string} username
   * @returns {Observable<BankBalanceModel>}
   */
  getBankBalance(username: string): Observable<BankBalanceModel> {
    const get_bank_balance_url = this.ROOT_URL + "bank/account/balance/" + username;

    return this.http.post(get_bank_balance_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * check if logged user has a broker account
   * @returns {Observable<BooleanValueModel>}
   */
  checkExistenceOfBrokerAccount(username: string): Promise<BooleanValueModel> {
    const get_broker_existence_url = this.ROOT_URL + "broker/account/check/" + username;

    return this.http.post(get_broker_existence_url, null, {
      headers: this.jsonHeader
    }).toPromise().then(this.extractData).catch(this.handleErrorPromise);
  }

  /**
   * create broker portfolio for the player
   * @param {string} username
   * @returns {Observable<any>}
   */
  createBrokerAccount(username: string) {
    const create_broker_account_url = this.ROOT_URL + "broker/account/createaccount";

    let createBrokerAccountFromName: CreateBrokerAccountFromName = {
      name: username
    };

    let createBrokerAccount: CreateBrokerAccountModel = {
      createBrokerAccountFromName: createBrokerAccountFromName
    };

    return this.http.post(create_broker_account_url, createBrokerAccount, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  /**
   * get portfolio from the broker
   * @param {string} username
   * @returns {Observable<PortfolioModel>}
   */
  getPortfolioFromBroker(username: string): Observable<PortfolioModel> {
    const get_portfolio_url = this.ROOT_URL + "broker/account/portfolio/" + username;

    return this.http.post(get_portfolio_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * buy stocks from the broker
   * @param {string} username
   * @param {string} stock
   * @param {number} quantity
   * @param {number} price
   * @returns {Observable<BuyObjectRoot>}
   */
  buyFromBroker(username: string, stock: string, quantity: number, price: number) {
    const buy_url = this.ROOT_URL + "broker/stock/buy";

    let stockAndUserDetails : StockAndUserDetails = {
      name: username,
      stock:stock,
      quantity:quantity,
      price:price
    };

    let buy : Buy = {
      stockAndUserDetails : stockAndUserDetails
    };

    let buyObjectRoot : BuyObjectRoot = {
      buy : buy
    };

    return this.http.post(buy_url, buyObjectRoot, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  /**
   * sell own stocks through the broker
   * @param {string} username
   * @param {string} stock
   * @param {number} quantity
   * @param {number} price
   * @returns {Observable<SellObjectRoot>}
   */
  sellThroughBroker(username: string, stock: string, quantity: number, price: number) {
    const sell_url = this.ROOT_URL + "broker/stock/sell";

    let stockAndUserDetails : StockAndUserDetails = {
      name: username,
      stock:stock,
      quantity:quantity,
      price:price
    };

    let sell : Sell = {
      stockAndUserDetails : stockAndUserDetails
    };

    let sellObjectRoot : SellObjectRoot= {
      sell : sell
    };

    return this.http.post(sell_url, sellObjectRoot, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  /**
   * join the game which will start within 60 seconds
   * @param {string} username
   * @returns {Observable<any>}
   */
  readyPlayer(username: string) {
    const ready_player_url = this.ROOT_URL + "game/ready/" + username;

    return this.http.post(ready_player_url, null, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  /**
   * send timely request to the server to get the status of the game
   * @returns {Observable<GameStatusModel>}
   */
  getGameStatus(): Observable<GameStatusModel> {
    const get_game_status_url = this.ROOT_URL + "game/status";

    return this.http.post(get_game_status_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * get analyser recommendation about the game
   * @returns {Observable<AnalyserRecommendationsModel>}
   */
  getAnalyserRecommendations(): Observable<AnalyserRecommendationsModel> {
    const get_analyser_recommendation_url = this.ROOT_URL + "game/analyser/recommendation";

    return this.http.post(get_analyser_recommendation_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * get final scoreboard of the players
   * @param {number} serverTurn
   * @returns {Observable<ScoreboardModel>}
   */
  getScoreBoard(serverTurn : number): Observable<ScoreboardModel> {
    const get_scoreboard_url = this.ROOT_URL + "player/scoreboard/" + serverTurn;

    return this.http.post(get_scoreboard_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * get rankings of the players, limit to first 10 players
   * @returns {Observable<RankingModel>}
   */
  getRankings(): Observable<RankingModel> {
    const get_ranking_url = this.ROOT_URL + "player/ranking";

    return this.http.post(get_ranking_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * extract data from response
   * @param res
   * @returns {any}
   */
  private extractData(res) {
    return res;
  }

  /**
   * handle errors of observable
   * @param error
   * @returns {Observable<any>}
   */
  private handleErrorObservable(error: any): Observable<any> {
    console.error('An error occurred in observable', error);
    return (error.message || error);
  }

  /**
   * handle errors of promise
   * @param error
   * @returns {Promise<any>}
   */
  private handleErrorPromise(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
