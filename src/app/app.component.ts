import {Component} from '@angular/core';
import {AuthService} from "./security/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'Stock Market Simulator';
  public userLoggedIn : boolean;
  public loggedInUsername : string;

  constructor(private authService:AuthService){
    this.authService.authInfo$.subscribe(
      (info) =>{
        this.userLoggedIn = info.isLoggedIn();
        this.loggedInUsername = info.getUsername();
      }
    )
  }

  logout(){
    this.authService.logout();
  }
}
