import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];
  
  userSubscription:Subscription;
  
  constructor(private api:ApiService) { 
  }

  ngOnInit() {
    this.loadMyEvents();
  }
  
  async loadMyEvents(){
      
    this.events = await this.api.get<Event[]>("me:events");
    
    this.events.sort((a,b) => b.dateFrom.localeCompare(a.dateFrom));
    
  }

}
