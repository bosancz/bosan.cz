import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { ProgramAdminService } from "../program-admin.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'event-approval',
  templateUrl: './event-approval.component.html',
  styleUrls: ['./event-approval.component.scss']
})
export class EventApprovalComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private api:ApiService, private toastService:ToastService, private programAdminService:ProgramAdminService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const options = {
      limit: 100,
      filter: {
        recurring: null
      },
      has_action: "publish",
      select: "_id status name description dateFrom dateTill leaders"
    };
    
    this.events = await this.api.get<Paginated<Event>>("events",options).then(paginated => paginated.docs);
  }
  
  async publishEvent(event:Event):Promise<void>{
    await this.api.post(event._actions.publish);
    this.toastService.toast("Publikováno.");
    await this.loadEvents();
    this.programAdminService.loadStats();
  }
}
