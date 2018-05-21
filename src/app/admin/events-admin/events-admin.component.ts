import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";

import { Event } from "../../schema/event";

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.getEvents()
      .then(events => this.events = events);      
  }

}
