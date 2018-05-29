import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../security/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : string = '';
  password : string = '';

  constructor(private authService:AuthService, private router: Router, private snackBar:MatSnackBar) { }

  ngOnInit() {
  }

  logUser(){
    this.authService.login(this.username,this.password).then(
      res=>{
        if(this.authService.authInfo$.value.isLoggedIn())
          this.router.navigate(['/profile']);
        else
          this.openLoginErrorSnackBar();
      }
    );

  }

  openLoginErrorSnackBar(){
    this.snackBar.open("Username or Password doesn't match",null, <MatSnackBarConfig>{
      duration: 2000
    });
  }
}
