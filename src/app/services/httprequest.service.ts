import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import "rxjs/Rx"
import {Authorization, PlayerLoginModel} from "../models/PlayerLoginModel";
import {CreatePlayerAccountForName, PlayerCreateModel} from "../models/PlayerCreateModel";

@Injectable({
  providedIn: 'root'
})
export class HttprequestService {
  readonly ROOT_URL = 'http://localhost:5000/';
  //readonly ROOT_URL = 'https://aws.amazon.bla.bla.bla:500/';

  constructor(private http: HttpClient) { }

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
  createPlayer(username:string, password:string) : Promise<Response>{
    const login_url = this.ROOT_URL+"player/createaccount";

    let createAccount : CreatePlayerAccountForName ={
      username: username,
      password: password
    };

    let userAccountCreateData : PlayerCreateModel = {
      createPlayerAccountForName : createAccount
    };

    return this.http.post(login_url, userAccountCreateData, {headers: this.jsonHeader, observe: 'response'}).toPromise().then(this.extractData).catch(this.handleError);
  }

  /**
   * player login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Response>}
   */
  loginPlayer(username:string, password:string) : Promise<Response>{
    const login_url = this.ROOT_URL+"player/login";

    let authorization : Authorization ={
      username: username,
      password: password
    };

    let userLoginData : PlayerLoginModel = {
      authorization : authorization
    };

    return this.http.post(login_url, userLoginData, {headers: this.jsonHeader, observe: 'response'}).toPromise().then(this.extractData).catch(this.handleError);
  }

  private extractData(res) {
    return res;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
