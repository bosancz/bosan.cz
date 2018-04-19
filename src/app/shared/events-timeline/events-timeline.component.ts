import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.template.html",
  styleUrls: ["events-timeline.style.css"]
})
export class EventsTimelineComponent implements OnInit {

  events:Event[]= [];
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
        
     this.dataService.getEventsUpcoming({limit:3}) 
      .then(events => this.events = events)
      .catch(err => this.toastService.toast(err.message,"error"));
  }

}
