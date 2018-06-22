import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../security/auth.service";
import {HttprequestService} from "../../services/httprequest.service";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";
import {Router} from "@angular/router";
import {GameStatus, Player, Turn, Turn1} from "../../models/GameStatus";
import {TimerObservable} from "rxjs-compat/observable/TimerObservable";
import {Stock, StockMarketModel} from "../../models/StockMarketModel";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  public readonly TIME_FOR_EACH_TURN_IN_SEC: number = 10;

  gameStatusObject: GameStatus = null;

  currentTurn: number = 1;
  currentArrayNumber = this.currentTurn - 1;
  currentArrayNumberForChart = 9 + this.currentTurn;
  currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;

  readyDivHiddenState: boolean = false;
  readyButtonHiddenState: boolean = false;
  gameDivHiddenState: boolean = true;

  isReadyGameRequestSuccessful: boolean = false;
  gameTurnTimerFunctionStartedExecuting: boolean = false;

  gameStatusCallTimer = TimerObservable.timer(0, 1000);
  gameStatusCallTimerSubscriber: any;

  gameTimeReducerTimer = TimerObservable.timer(0, 1000);
  gameTimeReducerTimerSubscriber: any;

  playerList: Player[] = [];
  playerListDisplayedColumns = ['players'];

  playerTransactionsOfTurnList: Turn[] = [];
  playerTransactionsOfTurnListDisplayedColumns = ['name', 'sellOrBuy', 'stock', 'quantity', 'stockPrice'];

  //stock chart variables
  public optionsLine: any;
  public stockMarketModel: StockMarketModel = null;
  private stockChartTitle: String = null;
  private stockName: String = null;
  private stockDataArray: number[];

  constructor(private authS: AuthService, private simulatorRequests: HttprequestService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.gameStatus();
  }

  readyGame() {
    if (this.gameStatusObject != null && !this.gameStatusObject.isGameStarted)
      this.readyGameRequest();
    else if (this.gameStatusObject.isGameStarted)
      this.openSnackBar("Game has already started. Try to join again in few minutes.");
    else
      this.openSnackBar("Please wait and try again.");
  }

  gameStatus() {
    this.gameStatusCallTimerSubscriber = this.gameStatusCallTimer.subscribe(
      res => {
        this.gameStatusRequest();
      }
    )
  }

  gameTurnTimerFunction() {
    this.gameTurnTimerFunctionStartedExecuting = true;

    //get stock market chart data
    this.getStockMarket();

    this.gameTimeReducerTimerSubscriber = this.gameTimeReducerTimer.subscribe(
      res => {

        if (this.currentTurn == 11) {
          //end the game here
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = false;

          this.gameStatusCallTimerSubscriber.unsubscribe();
          this.gameTimeReducerTimerSubscriber.unsubscribe();

          this.readyDivHiddenState = false;
          this.gameDivHiddenState = true;
          this.enableAllSurroundings();

        } else {

          if (this.currentTimeInSecWithinTurn == 0) {
            //reset the current time
            this.currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;
            //one turn is over so go to next turn
            this.currentTurn++;
          } else {
            this.currentTimeInSecWithinTurn--;
          }

        }
      }
    )
  }


  //=========================================//
  //API REQUESTS

  private gameStatusRequest() {
    this.simulatorRequests.getGameStatus().subscribe(
      res => {
        this.gameStatusObject = res;
        this.playerList = res.players;

        //if ready game request successful
        if (res != null && res.isGameReadyToStart && !res.isGameStarted && this.isReadyGameRequestSuccessful && res.timeToStartTheGameInSec > 0) {
          this.openSnackBar("Game will start within " + res.timeToStartTheGameInSec + "seconds");

        } else if (res != null && !res.isGameReadyToStart && res.isGameStarted && this.isReadyGameRequestSuccessful && res.timeToStartTheGameInSec == 0) {
          //starting the game
          this.readyDivHiddenState = true;
          this.gameDivHiddenState = false;
          this.disableAllSurroundings();

          //syncing local turn with server side turn
          if (this.currentTurn < res.gameLocalCurrentTurn) {
            this.currentTurn = res.gameLocalCurrentTurn;
            this.currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;
          }

          if (!this.gameTurnTimerFunctionStartedExecuting)
            this.gameTurnTimerFunction();

          //real time display user selling or buying
          if (this.currentTurn == 1)
            this.playerTransactionsOfTurnList = res.turn1;
          else if (this.currentTurn == 2)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2);
          else if (this.currentTurn == 3)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3);
          else if (this.currentTurn == 4)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4);
          else if (this.currentTurn == 5)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5);
          else if (this.currentTurn == 6)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5).concat(res.turn6);
          else if (this.currentTurn == 7)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5).concat(res.turn6).concat(res.turn7);
          else if (this.currentTurn == 8)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5).concat(res.turn6).concat(res.turn7).concat(res.turn8);
          else if (this.currentTurn == 9)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5).concat(res.turn6).concat(res.turn7).concat(res.turn8).concat(res.turn9);
          else if (this.currentTurn == 10)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2).concat(res.turn3).concat(res.turn4).concat(res.turn5).concat(res.turn6).concat(res.turn7).concat(res.turn8).concat(res.turn9).concat(res.turn10);

        } else if (res != null && res.isGameReadyToStart && !res.isGameStarted && this.isReadyGameRequestSuccessful && res.timeToStartTheGameInSec == 0 && !this.gameTurnTimerFunctionStartedExecuting) {
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = false;
          this.openSnackBar("Cannot start game - not enough players");
        }
      }
    )
  }

  private readyGameRequest() {
    this.simulatorRequests.readyPlayer(AuthService.getLoggedInUsername()).subscribe(
      res => {
        console.log(res.status);
        if (res.status == 200) {
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = true;
        }
      }, error => {
        this.openSnackBar("Cannot join game right now. There is on going game or sever player limit reached");
      }
    )
  }

  //getting stock market
  loadChart(stock: Stock) {
    this.stockChartTitle = "Stock Chart of " + stock.companyName;
    this.stockName = stock.stock;
    this.stockDataArray = stock.price.slice(0, this.currentArrayNumberForChart);

    this.loadCharData();
  }

  loadCharData() {
    this.optionsLine = {
      chart: {
        height: 400
      }, yAxis: {
        title: {
          text: "Stock Price"
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
    this.simulatorRequests.getStockMarket().subscribe(
      res => {
        this.stockMarketModel = res;
      }
    );
  }

  //get portfolio to get current own stock
  //get bank account balance

  //execute buy from broker
  //then refresh portfolio
  //then refresh bank account balance

  //execute sell from broker
  //then refresh portfolio
  //then refresh bank account balance


  public returnRoundPrice(price: number) {
    return "$" + (Math.round((price * 1000) / 10) / 100).toFixed(2);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, <MatSnackBarConfig>{
      duration: 2000
    });
  }

  disableAllSurroundings() {
    this.authS.gameSurroundingState$.next(true);
  }

  enableAllSurroundings() {
    this.authS.gameSurroundingState$.next(false);
  }

}
