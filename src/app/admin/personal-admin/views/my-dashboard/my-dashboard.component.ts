import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss']
})
export class MyDashboardComponent implements OnInit {

  noLeaderEvents:Event[];
  
  myFutureEvents:Event[] = [];
  
  myEventsAccounting:Event[] = [];
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadNoLeaderEvents();
  }
  
  async loadNoLeaderEvents(){
    
    this.noLeaderEvents = await this.api.get<Event[]>("events:noleader");
  }

}
