import {Component, OnInit} from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {AuthService} from "../../security/auth.service";
import {BroughtStockList, OwnStockList, SoldStockList} from "../../models/PortfolioModel";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public brokerPortfolioHasCreated: boolean = null;
  public hasPortfolioCreated: boolean = false;

  ownStockList: OwnStockList[] = [];
  ownStockListDisplayedColumns = ['stock', 'quantity'];

  broughtStockList: BroughtStockList[] = [];
  broughtStockListDisplayedColumns = ['stock', 'quantity', 'price', 'turn'];

  soldStockList: SoldStockList[] = [];
  soldStockListDisplayedColumns = ['stock', 'quantity', 'price', 'turn'];

  constructor(private portfolioRequests: HttprequestService) {
  }

  ngOnInit() {
    this.isBrokerAccountExists();
  }

  private isBrokerAccountExists() {
    this.portfolioRequests.checkExistenceOfBrokerAccount(AuthService.getLoggedInUsername()).then(
      res => {
        this.brokerPortfolioHasCreated = res.value;

        if (this.brokerPortfolioHasCreated)
          this.getPortfolio();

      }
    );
  }

  public createBrokerAccount() {
    this.portfolioRequests.createBrokerAccount(AuthService.getLoggedInUsername()).subscribe(
      res => {
        if (res.status == 200) {
          this.brokerPortfolioHasCreated = true;
          this.isBrokerAccountExists();
        }
      }
    )
  }

  private getPortfolio() {
    this.portfolioRequests.getPortfolioFromBroker(AuthService.getLoggedInUsername()).subscribe(
      res => {
        this.ownStockList = res.portfolio.ownStockList;
        this.broughtStockList = res.portfolio.broughtStockList;
        this.soldStockList = res.portfolio.soldStockList;
        this.hasPortfolioCreated = true;
      }
    )
  }

  public returnRoundPrice(price: number) {
    return "$" + (Math.round((price * 1000) / 10) / 100).toFixed(2);
  }
}

