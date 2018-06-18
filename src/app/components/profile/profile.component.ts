import { Component, OnInit } from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {AuthService} from "../../security/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public bankAccountHasCreated : boolean = false;

  constructor(private bankAccountRequests: HttprequestService) { }

  ngOnInit() {
    this.isBankAccountExists();
  }

  private isBankAccountExists() {
    this.bankAccountRequests.checkExistenceOfBankAccount(AuthService.getLoggeInUsername()).then(
      res => {
        this.bankAccountHasCreated = res.value;
      }
    );
  }

  public createBankAccount(){
    this.bankAccountRequests.createBankAccount(AuthService.getLoggeInUsername()).subscribe(
      res => {
        if(res.status == 200){
          this.bankAccountHasCreated = true;
        }
      }
    )
  }

}
