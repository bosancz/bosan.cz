import { Component, OnInit } from '@angular/core';

import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'event-approval',
  templateUrl: './event-approval.component.html',
  styleUrls: ['./event-approval.component.scss']
})
export class EventApprovalComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const options = {
      has_actions: "publish",
      limit: 100,
      select: "_id name description"
    };
    
    this.events = await this.dataService.getEvents(options).then(paginated => paginated.docs);
  }
}
