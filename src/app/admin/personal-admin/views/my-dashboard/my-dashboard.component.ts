import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss']
})
export class MyDashboardComponent implements OnInit {

  noLeaderEvents:Event[];
  
  myFutureEvents:Event[] = [{_id:"123",name:"Moje nejlepší akce",dateFrom:new Date(),dateTill:new Date(),status:"public",type:"akce",subtype:"podzimky",place:"",description:""}];
  
  myEventsAccounting:Event[] = [{_id:"123",name:"Moje druhá akce",dateFrom:new Date(),dateTill:new Date(),status:"public",type:"akce",subtype:"podzimky",place:"",description:""}];
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const options = {
      filter: {
        leaders: { $size:0 },
        dateFrom:{ $gte:new Date().toISOString().split("T")[0] }
      }
    };
    
    let events = await this.api.get<Paginated<Event>>("events",options);
    
    this.noLeaderEvents = events.docs;
  }

}
