import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";

@Component({
  selector: 'event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  
  event:Event;
  
  category:string;
  
  deleteConfirmation:boolean = false;
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.event && (!this.event || this.event._id !== params.event)) this.loadEvent(params.event);
      
      this.category = params.cat;

    });
  }
  
  // DB interaction
  async loadEvent(eventId:string){
    this.event = await this.dataService.getEvent(eventId);
  }
  
  async saveEvent(eventData:any){
    
    // if data provided update with data, otherwise send the current (possibly modified) state of event to the server
    await this.dataService.updateEvent(this.event._id,eventData || this.event);
    
    // send a toast with OK message
    this.toastService.toast("Uloženo.");
  }
  
  async deleteEvent(){
    var name = this.event.name;
    await this.dataService.deleteEvent(this.event._id)
    this.toastService.toast("Akce " + name + " smazána.");
    this.router.navigate(["/interni/akce"]);
  }

}
