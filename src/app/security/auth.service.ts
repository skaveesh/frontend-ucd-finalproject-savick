import { Injectable } from '@angular/core';
import {AuthInfo} from "./auth-info";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(private router:Router) { }

  login(username, password):Observable<AuthInfo> {
    let newAuthUser;

    if(username.localeCompare("hello") == 0 && password.localeCompare('123456') == 0){
      newAuthUser = new AuthInfo(username);

      console.log('yes', newAuthUser.isLoggedIn());
    }else{
      newAuthUser = new AuthInfo(null);
    }
    this.authInfo$.next(newAuthUser);
    return newAuthUser;
  }

  logout() {
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.router.navigate(['/login']);
  }

}
