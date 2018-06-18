import {Component, OnInit} from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {Stock, StockMarketModel} from "../../models/StockMarketModel";

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  public optionsLine: any;
  public stockMarketModel: StockMarketModel = null;
  private stockChartTitle : String = null;
  private stockName : String = null;
  private stockDataArray : number[];

  constructor(private stockMarket: HttprequestService) { }

  ngOnInit() {
    this.getStockMarket();
  }

  loadChart(stock : Stock){
    this.stockChartTitle = "Stock Chart of "+stock.companyName;
    this.stockName = stock.stock;
    // this.stockDataArray = stock.price.slice(0,10);
    this.stockDataArray = stock.price;
    this.loadCharData();
  }

  loadCharData(){
    this.optionsLine = {
      chart: {
        height: 400
      }, yAxis: {
        title:{
          text:"Stock Price"
        }
      },
      title: {text: this.stockChartTitle},
      series: [{
        name: this.stockName,
        data: this.stockDataArray
      }]
    }
  }

  private getStockMarket() {
    this.stockMarket.getStockMarket().subscribe(
      res => {
        this.stockMarketModel = res;
      }
    );
  }

}