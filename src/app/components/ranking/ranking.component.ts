import {Component, OnInit} from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {AuthService} from "../../security/auth.service";
import {Rank} from "../../models/RankingModel";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  public isRankingLoadingComplete: boolean = false;
  public playerName = AuthService.getLoggedInUsername();

  public rankingList : Rank[] = [];
  public rankingListDisplayedColumns = ['name','profit'];

  constructor(private rankingRequest: HttprequestService) {
  }

  ngOnInit() {
    this.getScoreboardRequest();
  }

  private getScoreboardRequest() {

    this.rankingRequest.getRankings().subscribe(
      res => {
        //already sorted with profit high to low
        this.rankingList = res.rank;

        this.isRankingLoadingComplete = true;

      }
    )

  }

  public returnRoundPrice(price: number) {
    return "$" + (Math.round((price * 1000) / 10) / 100).toFixed(2);
  }

}
