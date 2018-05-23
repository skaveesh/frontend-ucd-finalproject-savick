import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../security/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  username : string = '';
  password : string = '';

  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit() {
  }

  logUser(){
    this.authService.login(this.username,this.password);
    if(this.authService.authInfo$.value.isLoggedIn())
      this.router.navigate(['/profile']);
  }
}
