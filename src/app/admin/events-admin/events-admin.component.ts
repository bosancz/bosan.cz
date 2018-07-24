import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit {

  statuses:any = {
    "public": "veřejná",
    "draft": "v přípravě"
  }
  events:Event[] = [];
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(){
    this.dataService.getEvents()
      .then(events => this.events = events);    
  }
  
  getEventLink(event:Event):string{
    return './' + event._id;
  }
  
  openEvent(event:Event):void{
    this.router.navigate([this.getEventLink(event)], {relativeTo: this.route});
  }

  createEvent(){

    this.dataService.createEvent({name:"Neočekávaný dýchánek"})
      .then(event => {
        this.toastService.toast("Akce vytvořena a uložena.");
        this.router.navigate(["./" + event._id], {relativeTo: this.route})
      })
  }

}
