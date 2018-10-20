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
  
  myFutureEvents:Event[] = [{_id:"123",name:"Moje nejlepší akce",dateFrom:new Date(),dateTill:new Date(),status:"public",type:"akce",subtype:"podzimky",place:"",description:""}];
  
  myEventsAccounting:Event[] = [{_id:"123",name:"Moje druhá akce",dateFrom:new Date(),dateTill:new Date(),status:"public",type:"akce",subtype:"podzimky",place:"",description:""}];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    let events = await this.dataService.getEvents({filter:{leaders:{$size:0}, dateFrom:{$gte:new Date().toISOString().split("T")[0]}}});
    this.noLeaderEvents = events.docs;
  }

}
