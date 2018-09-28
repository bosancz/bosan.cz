import { Component, OnInit } from '@angular/core';

import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss']
})
export class AccountDashboardComponent implements OnInit {

  noLeaderEvents:Event[];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    let events = await this.dataService.getEvents({filter:{leaders:{$size:0}, dateFrom:{$gte:new Date().toISOString().split("T")[0]}}});
    this.noLeaderEvents = events.docs;
  }

}
