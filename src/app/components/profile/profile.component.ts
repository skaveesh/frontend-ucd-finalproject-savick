import { Component, OnInit } from '@angular/core';
import {HttprequestService} from "../../services/httprequest.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  requested : string = "not requested yet";

  constructor(private httprequestservice:HttprequestService) {
    Observable.interval(10 * 1000).subscribe(x=>{
      this.requested = "requesting....";
      //this.requestRandomDecimal();
    })
  }

  ngOnInit() {
  }

}
