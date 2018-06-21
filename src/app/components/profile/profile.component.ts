import {Component, OnInit} from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {AuthService} from "../../security/auth.service";
import {DepositTransaction, WithdrawTransaction} from "../../models/ProfileModel";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public bankAccountHasCreated: boolean = null;
  public hasProfileDownloaded: boolean = false;

  profileName : string = "";
  profileBalance : number = null;

  depositTransactionList: DepositTransaction[] = [];
  depositTransactionListDisplayedColumns = ['sender', 'amount', 'turn'];

  withdrawTransactionList: WithdrawTransaction[] = [];
  withdrawTransactionListDisplayedColumns = ['receiver', 'amount', 'turn'];

  constructor(private bankAccountRequests: HttprequestService) {
  }

  ngOnInit() {
    this.isBankAccountExists();
  }

  private isBankAccountExists() {
    this.bankAccountRequests.checkExistenceOfBankAccount(AuthService.getLoggeInUsername()).then(
      res => {
        this.bankAccountHasCreated = res.value;

        if (this.bankAccountHasCreated)
          this.getProfile();
      }
    );
  }

  public createBankAccount() {
    this.bankAccountRequests.createBankAccount(AuthService.getLoggeInUsername()).subscribe(
      res => {
        if (res.status == 200) {
          this.bankAccountHasCreated = true;
          this.isBankAccountExists();
        }
      }
    )
  }

  private getProfile() {
    this.bankAccountRequests.getProfileFromBank(AuthService.getLoggeInUsername()).subscribe(
      res => {
        this.profileName = res.profile.name;
        this.profileBalance = res.profile.balance;
        this.depositTransactionList = res.profile.depositTransaction;
        this.withdrawTransactionList = res.profile.withdrawTransaction;
        this.hasProfileDownloaded = true;
      }
    )
  }

  public returnRoundPrice(price: number) {
    return "$" + (Math.round((price * 1000) / 10) / 100).toFixed(2);
  }

}
