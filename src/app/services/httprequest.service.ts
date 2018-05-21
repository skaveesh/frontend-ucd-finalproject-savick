import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Params, RandomDecimalRequest} from "../modules/RandomDecimalRequest";
import "rxjs/Rx"

@Injectable({
  providedIn: 'root'
})
export class HttprequestService {
  readonly ROOT_URL = 'https://api.random.org/';
  readonly API_KEY = '95f6aad8-91c1-46d7-b14d-3e5dfd81ea02';
  readonly REQUST_METHOD = 'generateDecimalFractions';
  readonly JSON_RPC = '2.0';

  constructor(private http: HttpClient) { }

  getRandomDecimal(id:number, n:number, decimalPlaces:number, replacement:boolean){
    const post_url = this.ROOT_URL + "json-rpc/1/invoke";

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json'
      });

    let parameters: Params = {
      apiKey : this.API_KEY,
      n : n,
      decimalPlaces : decimalPlaces,
      replacement : replacement
    };

    let rdr: RandomDecimalRequest = {
      jsonrpc : this.JSON_RPC,
      method : this.REQUST_METHOD,
      params : parameters,
      id : id
    };

    return this.http.post(post_url, rdr, {headers: headers});
  }
}
