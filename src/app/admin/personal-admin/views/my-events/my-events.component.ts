import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";

import { Paginated } from "app/shared/schema/paginated";
import { Event } from "app/shared/schema/event";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];

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
