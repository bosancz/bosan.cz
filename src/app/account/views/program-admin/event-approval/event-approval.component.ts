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
      has_actions: "publish",
      limit: 100,
      select: "_id status name description _actions"
    };
    
    this.events = await this.api.get<Paginated<Event>>("events",options).then(paginated => paginated.docs);
  }
  
  async publishEvent(event:Event):Promise<void>{
    await this.api.post(event._actions.publish);
    
    this.toastService.toast("Publikováno.");
    
    this.loadEvents();
  }
}
