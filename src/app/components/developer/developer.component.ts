import { Component, OnInit } from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.css'],
  animations: [
    trigger('castStyleAnimation', [
      state('smallState',style({
        opacity: '0',
        transform: 'scale(0)'
      })),
      state('originalState',style({
        opacity: '1',
        transform: 'scale(1)'
      })),

      transition('smallState => originalState', animate('500ms ease-in', keyframes([
        style({opacity:0, transform:'scale(0)', offset: 0}),
        style({opacity:0.5, transform:'scale(2)', offset: 0.5}),
        style({opacity:1, transform:'scale(1)', offset: 1}),
      ]))),
    ]),
  ]
})
export class DeveloperComponent implements OnInit {

  public state : string = 'smallState';

  constructor() {
  }

  ngOnInit() {

    setTimeout(()=>{
      this.state = 'originalState';
    },500);
  }

}
