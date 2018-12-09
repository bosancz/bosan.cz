import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'event-approval',
  templateUrl: './event-approval.component.html',
  styleUrls: ['./event-approval.component.scss']
})
export class EventApprovalComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private api:ApiService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const options = {
      limit: 100,
      filter: {
        recurring: null
      },
      has_link: "publish",
      select: "_id status name description _actions"
    };
    
    console.log(options);
    
    this.events = await this.api.get<Paginated<Event>>("events",options).then(paginated => paginated.docs);
  }
  
  async reloadEvent(event:Event){
    const i = this.events.indexOf(event);
    const newEvent = await this.api.get<Event>(event._links.self);
    this.events.splice(i, 1, newEvent);
  }
  
  async publishEvent(event:Event):Promise<void>{
    await this.api.post(event._links.publish);
    this.toastService.toast("Publikováno.");
    await this.reloadEvent(event);
  }
  
   async unpublishEvent(event:Event):Promise<void>{
    await this.api.post(event._links.unpublish);
    this.toastService.toast("Vráceno do připravovaných akcí.");
    await this.reloadEvent(event);
  }
}
