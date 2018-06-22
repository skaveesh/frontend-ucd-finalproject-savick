import {Injectable} from '@angular/core';
import {AuthInfo} from "./auth-info";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {HttprequestService} from "../services/httprequest.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static UNKNOWN_USER = new AuthInfo(null);
  static GAME_SURROUNDING_STATUS : boolean = false;

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  gameSurroundingState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(AuthService.GAME_SURROUNDING_STATUS);

  public static userLoggedIn : boolean;
  public static loggedInUsername : string;

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

        statusCode = res.status;

        if (statusCode == 200)
          newAuthUser = new AuthInfo(username);

        this.authInfo$.next(newAuthUser);
        return newAuthUser;
      }).catch(
        err => {
          return new AuthInfo(null);
        }
      );
  }

  logout() {
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.router.navigate(['/login']);
  }

  public static isUserLoggedIn(){
    return AuthService.userLoggedIn;
  }

  public static getLoggedInUsername(){
    return AuthService.loggedInUsername;
  }
}
