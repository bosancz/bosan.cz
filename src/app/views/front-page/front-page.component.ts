import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";

@Component({
  selector: 'front-page',
  templateUrl: "front-page.template.html",
  styleUrls: ["front-page.style.css"]
})
export class FrontPageComponent implements OnInit {
  
  recentEvents:Event[] = [];

  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
    this.dataService.getEventsRecent({limit:5,images:1}) 
      .then(events => this.recentEvents = events)
      .catch(err => this.toastService.toast(err.message,"error"));
  }
  
  getEventLink(event:Event){
    return "/akce/" + event._id;
  }

}
