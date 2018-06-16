import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";
import {Router} from "@angular/router";
import {HttprequestService} from "../../services/httprequest.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  username: string = '';
  password: string = '';
  confirmpassword: string = '';

  constructor(private signupRequest: HttprequestService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  createPlayer() {

    if(this.password.length >= 6 && this.username.length) {
      if (this.password === this.confirmpassword) {
        void this.signupRequest.createPlayer(this.username, this.password)
          .then(res => {
            let statusCode;

            statusCode = res.status;

            if (statusCode == 200)
              this.openLoginSuccessSnackBar();
          }).catch(
            err => {
              this.openLoginErrorSnackBar();
            }
          );
      } else
        this.passwordDoesNotMatchSnackBar();
    }else
      this.passwordLengthNotEnoughSnackBar();

  }

  passwordLengthNotEnoughSnackBar() {
    this.snackBar.open("Username and password length should be at least 6 characters long.", null, <MatSnackBarConfig>{
      duration: 2000
    });
  }

  passwordDoesNotMatchSnackBar() {
    this.snackBar.open("Password and confirmation password does not match.", null, <MatSnackBarConfig>{
      duration: 2000
    });
  }

  openLoginSuccessSnackBar() {
    this.snackBar.open("Player creation successful. Please login to continue.", null, <MatSnackBarConfig>{
      duration: 2000
    });
    this.router.navigate(['/login']);
  }

  openLoginErrorSnackBar() {
    this.snackBar.open("Player creation unsuccessful. Try using different username!", null, <MatSnackBarConfig>{
      duration: 2000
    });
  }

}
