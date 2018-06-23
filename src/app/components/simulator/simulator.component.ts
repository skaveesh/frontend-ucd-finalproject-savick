import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../security/auth.service";
import {HttprequestService} from "../../services/httprequest.service";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";
import {Router} from "@angular/router";
import {GameStatus, Player, Turn} from "../../models/GameStatus";
import {TimerObservable} from "rxjs-compat/observable/TimerObservable";
import {Stock, StockMarketModel} from "../../models/StockMarketModel";
import {OwnStockList} from "../../models/PortfolioModel";
import {Score} from "../../models/Scoreboard";
import {GamestatusService} from "../../services/gamestatus.service";
import * as Confeti from '../../../assets/confeti.js';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  public readonly TIME_FOR_EACH_TURN_IN_SEC: number = 10;

  gameStatusObject: GameStatus = null;

  public playerName: string = AuthService.getLoggedInUsername();
  public playerInitialBalance: number = 0;

  currentTurn: number = 1;
  currentArrayNumber = this.currentTurn - 1;
  currentArrayNumberForChart = 9 + this.currentTurn;
  currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;

  serverStartTurn: number = 0;

  disableReadyButton: boolean = false;
  readyDivHiddenState: boolean = false;
  readyButtonHiddenState: boolean = false;
  gameDivHiddenState: boolean = true;
  scoreBoardDivHiddenState = true;

  readyButtonText: string = "Ready";

  isReadyGameRequestSuccessful: boolean = false;
  gameTurnTimerFunctionStartedExecuting: boolean = false;

  gameStatusCallTimer = TimerObservable.timer(0, 1000);
  gameStatusCallTimerSubscriber: any = null;

  gameTimeReducerTimer = TimerObservable.timer(0, 1000);
  gameTimeReducerTimerSubscriber: any = null;

  playerList: Player[] = [];
  playerListDisplayedColumns = ['players'];

  playerTransactionsOfTurnList: Turn[] = [];
  playerTransactionsOfTurnListDisplayedColumns = ['name', 'sellOrBuy', 'stock', 'quantity', 'stockPrice'];

  //stock chart variables
  public isChartLoadedForFirstTime = false;
  public optionsLine: any;
  public stockMarketModel: StockMarketModel = null;
  private stockChartTitle: String = null;
  public stockName: String = null;
  public stockDataArray: number[] = [];

  //currently own stock variables
  public ownStockList: OwnStockList[] = [];
  public ownStockListDisplayedColumns = ['stock', 'quantity'];

  //bank balance variables
  public profileBalance: number = 0;

  //analyser
  public analyserRecommendationArray: string[] = [];
  public analyserRecommendationRemoveChip: boolean = false;

  //scoreboard variables
  //initial value should be null because sometimes if any player didn't do transaction in the game response will be empty
  public isScoreLoadingComplete: boolean = false;
  playerScoreboardList: Score[] = [];
  playerScoreboardListDisplayedColumns = ['name', 'startBalance', 'endBalance', 'profit'];

  constructor(private authS: AuthService, private simulatorRequests: HttprequestService, private router: Router, private snackBar: MatSnackBar, private gamestatusService: GamestatusService) {

  }


  ngOnInit() {
  }

  readyGame() {

    this.gameStatus();
    this.disableReadyButton = true;
    this.readyButtonText = "Please Wait...";

    setTimeout(() => {
      this.disableReadyButton = false;
      this.readyButtonText = "Ready";

      if (this.gameStatusObject != null && !this.gameStatusObject.isGameStarted)
        this.readyGameRequest();
      else if (this.gameStatusObject.isGameStarted) {
        this.openSnackBar("Game has already started. Try to join again in few minutes.");
        if (this.gameStatusCallTimerSubscriber != null)
          this.gameStatusCallTimerSubscriber.unsubscribe();
      } else {
        this.openSnackBar("Please wait and try again.");
        if (this.gameStatusCallTimerSubscriber != null)
          this.gameStatusCallTimerSubscriber.unsubscribe();
      }
    }, 3000);

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
    this.getStockMarketRequest();

    //get profile details
    this.getBankBalanceRequest();
    this.getPortfolioRequest();

    //get analyser recommendations
    this.getAnalyserRecommendationRequest();

    this.gameTimeReducerTimerSubscriber = this.gameTimeReducerTimer.subscribe(
      res => {

        if (this.currentTurn == 11) {
          //end the game here
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = false;

          if (this.gameStatusCallTimerSubscriber != null)
            this.gameStatusCallTimerSubscriber.unsubscribe();

          if (this.gameTimeReducerTimerSubscriber != null)
            this.gameTimeReducerTimerSubscriber.unsubscribe();

          //hide the game div
          this.gameDivHiddenState = true;

          //get score board
          this.getScoreboard();

        } else {

          if (this.currentTimeInSecWithinTurn == 0) {
            //reset the current time
            this.currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;
            //one turn is over so go to next turn
            this.currentTurn++;
            //also change chart number for slicing
            this.currentArrayNumberForChart = 9 + this.currentTurn;
            //also change current array number
            this.currentArrayNumber = this.currentTurn - 1;
            //re enable removed analyser recommendation chip
            this.analyserRecommendationRemoveChip = false;

            console.log("arr " + this.currentArrayNumberForChart + " ct " + this.currentTurn);
            //when turn is +1 load chart as well
            if (this.currentTurn < 11)
              this.loadCharData();
          } else {
            this.currentTimeInSecWithinTurn--;
          }

        }
      }
    )
  }


  private getScoreboard() {

    this.getScoreboardRequest();
    this.scoreBoardDivHiddenState = false;

    setTimeout(() => {
      //waiting before resetting state
      //reset all the values to initial state
      this.resetSimulator();
      Confeti.animationOffFuncE();

    }, 10000);


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


          //get server turn number
          this.serverStartTurn = res.gameStartTurn;

          //syncing local turn with server side turn
          if (this.currentTurn < res.gameLocalCurrentTurn) {
            this.currentTimeInSecWithinTurn = 0;
          }

          //only one time executing for the whole game
          if (!this.gameTurnTimerFunctionStartedExecuting) {
            this.gameTurnTimerFunction();

            //get player initial balance
            res.players.filter(
              player => {
                if (player.name.localeCompare(this.playerName) == 0)
                  this.playerInitialBalance = player.startBalance;
              }
            );
          }

          //real time display user selling or buying
          if (this.currentTurn == 1)
            this.playerTransactionsOfTurnList = res.turn1;
          else if (this.currentTurn == 2)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2);
          else if (this.currentTurn == 3)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3);
          else if (this.currentTurn == 4)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4);
          else if (this.currentTurn == 5)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5);
          else if (this.currentTurn == 6)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5, res.turn6);
          else if (this.currentTurn == 7)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5, res.turn6, res.turn7);
          else if (this.currentTurn == 8)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5, res.turn6, res.turn7, res.turn8);
          else if (this.currentTurn == 9)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5, res.turn6, res.turn7, res.turn8, res.turn9);
          else if (this.currentTurn == 10)
            this.playerTransactionsOfTurnList = res.turn1.concat(res.turn2, res.turn3, res.turn4, res.turn5, res.turn6, res.turn7, res.turn8, res.turn9, res.turn10);

        } else if (res != null && res.isGameReadyToStart && !res.isGameStarted && this.isReadyGameRequestSuccessful && res.timeToStartTheGameInSec == 0 && !this.gameTurnTimerFunctionStartedExecuting) {
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = false;
          this.openSnackBar("Cannot start game - not enough players");

          if (this.gameStatusCallTimerSubscriber != null)
            this.gameStatusCallTimerSubscriber.unsubscribe();
        }
      }
    )
  }

  private readyGameRequest() {
    this.simulatorRequests.readyPlayer(AuthService.getLoggedInUsername()).subscribe(
      res => {
        if (res.status == 200) {
          this.isReadyGameRequestSuccessful = this.readyButtonHiddenState = true;
        }
      }, error => {
        this.openSnackBar("Cannot join game right now. There is on going game or sever error");
        if (this.gameStatusCallTimerSubscriber != null)
          this.gameStatusCallTimerSubscriber.unsubscribe();
      }
    )
  }

  //getting stock market
  loadChart(stock: Stock) {
    this.isChartLoadedForFirstTime = true;

    this.stockChartTitle = "Stock Chart of " + stock.companyName;
    this.stockName = stock.stock;
    this.stockDataArray = stock.price;

    this.loadCharData();
  }

  loadCharData() {
    if (this.isChartLoadedForFirstTime)
      this.optionsLine = {
        chart: {
          height: 400,
          backgroundColor: "#383838"
        },
        yAxis: {
          title: {
            text: "Stock Price",
            style: {
              color: "#FFFFFF"
            }
          }
        },
        title: {
          text: this.stockChartTitle,
          style: {
            color: "#FFFFFF"
          }
        },
        series: [{
          name: this.stockName,
          data: this.stockDataArray.slice(0, this.currentArrayNumberForChart)
        }]
      }
  }

  private getStockMarketRequest() {
    this.simulatorRequests.getStockMarket().subscribe(
      res => {
        this.stockMarketModel = res;
      }
    );
  }

  //get portfolio to get current own stock
  //get bank account balance
  private getPortfolioRequest() {
    this.simulatorRequests.getPortfolioFromBroker(AuthService.getLoggedInUsername()).subscribe(
      res => {
        this.ownStockList = res.portfolio.ownStockList;
      }
    )
  }

  private getBankBalanceRequest() {
    this.simulatorRequests.getBankBalance(AuthService.getLoggedInUsername()).subscribe(
      res => {
        this.profileBalance = res.balanceAmount.amount;
      }
    )
  }


  //execute buy from broker
  //then refresh portfolio
  //then refresh bank account balance
  public buyRequest(stock: string, quantity: number, price: number) {
    this.simulatorRequests.buyFromBroker(AuthService.getLoggedInUsername(), stock, quantity, price).subscribe(
      res => {
        if (res.status == 200) {
          this.openSnackBar("Transaction successful!");
          this.getBankBalanceRequest();
          this.getPortfolioRequest();
        }
      }, error => {
        this.openSnackBar("Cannot buy. Check quantity, stock price and your bank balance (No two transaction per turn)");
      }
    )
  }

  //execute sell from broker
  //then refresh portfolio
  //then refresh bank account balance
  public sellRequest(stock: string, quantity: number, price: number) {
    this.simulatorRequests.sellThroughBroker(AuthService.getLoggedInUsername(), stock, quantity, price).subscribe(
      res => {
        if (res.status == 200) {
          this.openSnackBar("Transaction successful!");
          this.getBankBalanceRequest();
          this.getPortfolioRequest();
        }
      }, error => {
        this.openSnackBar("Cannot sell. Check selling stock quantity with your currently own stocks (No two transaction per turn)");
      }
    )
  }

  // get analyser recommendation
  private getAnalyserRecommendationRequest() {
    this.simulatorRequests.getAnalyserRecommendations().subscribe(
      res => {
        this.analyserRecommendationArray = res.recommendations;
      }
    )
  }

  private getScoreboardRequest() {

    this.simulatorRequests.getScoreBoard(this.serverStartTurn).subscribe(
      res => {
        this.playerScoreboardList = res.score.sort(this.compareProfit);

        //check if the winner is logged in user. if so display celebration animation
        if (this.playerScoreboardList.length > 0 && this.playerScoreboardList[0].name.localeCompare(this.playerName) == 0) {
          Confeti.confetiAnimationE();
          Confeti.animationOnFuncE();
        }

        this.isScoreLoadingComplete = true;

      }
    )

  }

  private compareProfit(a, b) {
    if (a.profit < b.profit)
      return 1;
    if (a.profit > b.profit)
      return -1;
    return 0;
  }

  private resetSimulator() {
    this.currentTurn = 1;
    this.currentArrayNumber = this.currentTurn - 1;
    this.currentArrayNumberForChart = 9 + this.currentTurn;
    this.currentTimeInSecWithinTurn = this.TIME_FOR_EACH_TURN_IN_SEC;

    this.serverStartTurn = 0;

    this.disableReadyButton = false;
    this.readyDivHiddenState = false;
    this.readyButtonHiddenState = false;
    this.gameDivHiddenState = true;
    this.scoreBoardDivHiddenState = true;

    this.readyButtonText = "Ready";

    this.isReadyGameRequestSuccessful = false;
    this.gameTurnTimerFunctionStartedExecuting = false;

    this.gameStatusCallTimerSubscriber = null;

    this.gameTimeReducerTimerSubscriber = null;

    this.playerList = [];

    this.playerTransactionsOfTurnList = [];

    //stock chart variables
    this.isChartLoadedForFirstTime = false;
    this.stockMarketModel = null;
    this.stockChartTitle = null;
    this.stockName = null;
    this.stockDataArray = [];

    //currently own stock variables
    this.ownStockList = [];

    //bank balance variables
    this.profileBalance = 0;

    //analyser
    this.analyserRecommendationArray = [];
    this.analyserRecommendationRemoveChip = false;

    //scoreboard
    this.isScoreLoadingComplete = false;
    this.playerScoreboardList = [];

    //enables surrounding buttons
    this.enableAllSurroundings();

  }

  public returnRoundPrice(price: number) {
    return "$" + (Math.round((price * 1000) / 10) / 100).toFixed(2);
  }

  public stringToInt(stringNumber: string) {
    return parseInt(stringNumber);
  }

  public isStringEmpty(stringText: string) {
    return stringText.trim().localeCompare("") == 0;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, <MatSnackBarConfig>{
      duration: 2000
    });
  }

  disableAllSurroundings() {
    this.gamestatusService.gameSurroundingState$.next(true);
  }

  enableAllSurroundings() {
    this.gamestatusService.gameSurroundingState$.next(false);
  }
}
