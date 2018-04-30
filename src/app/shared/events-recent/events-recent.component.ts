import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { Event } from "../../schema/event";

@Component({
  selector: 'events-recent',
  templateUrl: './events-recent.component.html',
  styleUrls: ['./events-recent.component.css']
})
export class EventsRecentComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    
    let query:any = {limit: 5, images: 1, till: new Date(), sort: "-dateFrom" };
    
    this.dataService.getEvents(query) 
      .then(events => events.sort((a,b) => (new Date(b.dateFrom)).getTime() - (new Date(a.dateTill)).getTime()))
      .then(events => this.events = events)
      .catch(err => console.error(err));
  }
  
  getEventLink(event:Event){
    return "/akce/" + event._id;
  }

}
