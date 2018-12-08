import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit, OnDestroy {
  
  event:Event;
  
  category:string;
  
  deleteConfirmation:boolean = false;
  
  paramsSubscription:Subscription;

  constructor(private api:ApiService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.event && (!this.event || this.event._id !== params.event)) this.loadEvent(params.event);
      
      this.category = params.cat;

    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  // DB interaction
  async loadEvent(eventId:string){
    let options = {
      id: eventId,
      populate: ["leaders"]
    };
    this.event = await this.api.get<Event>("event",options);
  }
  
  async saveEvent(eventData:any){
    
    // if data provided update with data, otherwise send the current (possibly modified) state of event to the server
    await this.api.patch(this.event._links.self,eventData || this.event);
    
    // load the updated version of event
    this.event = await this.api.get<Event>(this.event._links.self);
    
    // send a toast with OK message
    this.toastService.toast("Uloženo.");
  }
  
  async deleteEvent(){
    let name = this.event.name;
    await this.api.delete(this.event._links.self);
    this.toastService.toast("Akce " + name + " smazána.");
    this.router.navigate(["../../"],{relativeTo:this.route});
  }
  
  async publishEvent(){
    await this.api.post(this.event._links.publish);
    this.loadEvent(this.event._id);
    this.toastService.toast("Publikováno.");
  }
    

}
