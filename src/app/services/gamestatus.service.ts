import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class GamestatusService {

  static GAME_SURROUNDING_STATUS : boolean = false;

  constructor() { }

  gameSurroundingState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(GamestatusService.GAME_SURROUNDING_STATUS);

}
