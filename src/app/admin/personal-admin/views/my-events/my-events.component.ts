import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";
import { AuthService } from "app/services/auth.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];
  
  today:Date;
  
  status:string;
  
  constructor(private authService:AuthService, private api:ApiService) { 
    this.today = new Date();
    this.today.setHours(0,0,0,0);
  }

  ngOnInit() {
    this.authService.user.subscribe(user => this.loadMyEvents(user));
  }
  
  async loadMyEvents(user){
    
    this.status = "loading";
    
    const memberId:string = user.memberId;
    
    if(!memberId){
      this.status = "nomember";
      return;
    }
    
    const today = new Date(); today.setHours(0,0,0,0);
    
    const requestOptions = {
      filter: {
        leaders: memberId
      },
      select: "_id name dateFrom dateTill description leaders attendees status",
      populate: ["leaders","attendees"]
    };
    
    this.events = await this.api.get<Paginated<Event>>("events",requestOptions).then(paginated => paginated.docs)
    
    this.events.forEach(event => {
      event.dateFrom = new Date(event.dateFrom);
      event.dateTill = new Date(event.dateTill);
    });
    
    this.events.sort((a,b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    
    this.status = "loaded";
    
  }

}
