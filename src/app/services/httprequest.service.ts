import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import "rxjs/Rx"
import {Authorization, PlayerLoginModel} from "../models/PlayerLoginModel";
import {CreatePlayerAccountForName, PlayerCreateModel} from "../models/PlayerCreateModel";
import {Observable} from "rxjs/Observable";
import {StockMarketModel} from "../models/StockMarketModel";
import {BooleanValue} from "../models/BooleanValue";
import {CreateBrokerAccount, CreateBrokerAccountFromName} from "../models/CreateBrokerAccount";
import {CreateBankAccount, CreateBankAccountFromName} from "../models/CreateBankAccount";
import {PortfolioModel} from "../models/PortfolioModel";
import {ProfileModel} from "../models/ProfileModel";

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
   * @returns {Observable<BooleanValue>}
   */
  checkExistenceOfBankAccount(username: string): Promise<BooleanValue> {
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

    let createBankAccount: CreateBankAccount = {
      createBankAccountFromName: createBankAccountFromName
    };

    return this.http.post(create_broker_account_url, createBankAccount, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  getProfileFromBank(username: string) : Observable<ProfileModel>{
    const get_profile_url = this.ROOT_URL + "bank/account/profile/" + username;

    return this.http.post(get_profile_url, null, {
      headers: this.jsonHeader
    }).catch(this.handleErrorObservable);
  }

  /**
   * check if logged user has a broker account
   * @returns {Observable<BooleanValue>}
   */
  checkExistenceOfBrokerAccount(username: string): Promise<BooleanValue> {
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

    let createBrokerAccount: CreateBrokerAccount = {
      createBrokerAccountFromName: createBrokerAccountFromName
    };

    return this.http.post(create_broker_account_url, createBrokerAccount, {
      headers: this.jsonHeader,
      observe: 'response'
    }).catch(this.handleErrorPromise);
  }

  getPortfolioFromBroker(username: string) : Observable<PortfolioModel>{
    const get_portfolio_url = this.ROOT_URL + "broker/account/portfolio/" + username;

    return this.http.post(get_portfolio_url, null, {
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
