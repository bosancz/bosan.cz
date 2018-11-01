import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent implements OnInit {

  year:number;
  
  constructor() {
    this.year = (new Date()).getFullYear();
  }

  ngOnInit() {
  }

}
