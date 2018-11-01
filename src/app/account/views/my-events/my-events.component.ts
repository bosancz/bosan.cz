import { Component, OnInit } from '@angular/core';

import { DataService } from "app/services/data.service";
import { AuthService } from "app/services/auth.service";

import { Event } from "app/schema/event";
import { Paginated } from "app/schema/paginated";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];
  
  today:Date;
  
  constructor(private authService:AuthService, private dataService:DataService) { 
    this.today = new Date();
    this.today.setHours(0,0,0,0);
  }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const userId:string = this.authService.user.memberId;
    
    const today = new Date(); today.setHours(0,0,0,0);
    
    const requestOptions = {
      filter: {
        leaders: userId
      },
      select: "_id name dateFrom dateTill description leaders attendees status",
      populate: ["leaders"]
    };
    
    this.events = await this.dataService.getEvents(requestOptions).then(paginated => paginated.docs)
    
    this.events.forEach(event => {
      event.dateFrom = new Date(event.dateFrom);
      event.dateTill = new Date(event.dateTill);
    });
    
    this.events.sort((a,b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    
  }

}
