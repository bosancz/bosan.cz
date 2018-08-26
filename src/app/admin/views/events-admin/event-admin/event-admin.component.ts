import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../../../services/data.service";
import { ToastService } from "../../../../services/toast.service";

import { Event } from "../../../../schema/event";

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

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
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
      leaders:1
    }
    this.event = await this.dataService.getEvent(eventId,options);
  }
  
  async saveEvent(eventData:any,noToast?:boolean){
    
    // if data provided update with data, otherwise send the current (possibly modified) state of event to the server
    await this.dataService.updateEvent(this.event._id,eventData || this.event);
    
    // load the updated version of event
    await this.loadEvent(this.event._id);
    
    // send a toast with OK message
    if(!noToast) this.toastService.toast("Uloženo.");
  }
  
  async deleteEvent(){
    var name = this.event.name;
    await this.dataService.deleteEvent(this.event._id)
    this.toastService.toast("Akce " + name + " smazána.");
    this.router.navigate(["/interni/akce"]);
  }
  
  async publishEvent(){
    await this.saveEvent({status:"public"},true);
    this.toastService.toast("Publikováno.");
  }
    

}
