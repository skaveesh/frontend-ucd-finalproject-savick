import {Injectable} from '@angular/core';
import {AuthInfo} from "./auth-info";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {HttprequestService} from "../services/httprequest.service";
import {AuthModel} from "../models/AuthModel";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  public static userLoggedIn: boolean;
  public static loggedInUsername: string;

  constructor(private router: Router, private loginRequest: HttprequestService) {
    this.authInfo$.subscribe(
      (info) => {
        AuthService.userLoggedIn = info.isLoggedIn();
        AuthService.loggedInUsername = info.getUsername();
      });
  }

  login(username, password): Promise<AuthInfo> {
    return this.loginRequest.loginPlayer(username, password)
      .then(res => {
        let newAuthUser, statusCode;
        let auth: AuthModel;

        statusCode = res.status;
        auth = res.body;

        if (statusCode == 200) {
          newAuthUser = new AuthInfo(username);
          //save auth to local storage
          localStorage.setItem('username', username);
          localStorage.setItem('auth', auth.auth);
        }

        this.authInfo$.next(newAuthUser);
        return newAuthUser;
      }).catch(
        err => {
          return new AuthInfo(null);
        }
      );
  }

  loginWithAuth(username): Promise<AuthInfo> {
    return this.loginRequest.loginPlayerWithAuth()
      .then(res => {
        let newAuthUser, statusCode;
        let auth: AuthModel;

        statusCode = res.status;
        auth = res.body;

        if (statusCode == 200) {
          newAuthUser = new AuthInfo(username);
          //save auth to local storage
          localStorage.setItem('username', username);
          localStorage.setItem('auth', auth.auth);
        }

        this.authInfo$.next(newAuthUser);
        return newAuthUser;
      }).catch(
        err => {
          return new AuthInfo(null);
        }
      );
  }

  logout() {
    localStorage.clear();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.router.navigate(['/login']);
  }

  public static isUserLoggedIn() {
    return AuthService.userLoggedIn;
  }

  public static getLoggedInUsername() {
    return AuthService.loggedInUsername;
  }
}
