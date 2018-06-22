import {Component} from '@angular/core';
import {AuthService} from "./security/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'Stock Market Simulator';
  public userLoggedIn : boolean = false;
  public loggedInUsername : string = "";

  public surroundingDisable : boolean = false;

  constructor(private authService:AuthService){
    this.authService.authInfo$.subscribe(
      (info) =>{
        this.userLoggedIn = info.isLoggedIn();
        this.loggedInUsername = info.getUsername();
      }
    );

    this.authService.gameSurroundingState$.subscribe(
      (info) =>{
        this.surroundingDisable = info;
      }
    )

  }

  logout(){
    this.authService.logout();
  }
}
