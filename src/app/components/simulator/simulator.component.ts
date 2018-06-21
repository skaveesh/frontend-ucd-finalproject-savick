import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../security/auth.service";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {



  constructor(private authS:AuthService) { }

  ngOnInit() {
  }

  disableAll(){
    this.authS.gameStart$.next(true);
  }

  enableAll(){
    this.authS.gameStart$.next(false);
  }

}
