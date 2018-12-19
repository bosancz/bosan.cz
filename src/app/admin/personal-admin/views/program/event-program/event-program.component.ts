import { Component, OnInit } from '@angular/core';
import { DateTime } from "luxon";

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { ProgramAdminService } from "../program-admin.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'event-program',
  templateUrl: './event-program.component.html',
  styleUrls: ['./event-program.component.scss']
})
export class EventProgramComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private api:ApiService, private toastService:ToastService, private programAdminService:ProgramAdminService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    const options = {
      filter: {
        status: "public",
        dateTill: { $gte: DateTime.local().toISODate() },
        recurring: null
      },
      select: "_id name description dateFrom dateTill leaders status cancelled"
    };
    
    this.events = await this.api.get<Paginated<Event>>("events",options).then(paginated => paginated.docs);
  }
  
  async reload(){
    await this.loadEvents();
    this.programAdminService.loadStats();
  }

  async unpublishEvent(event:Event):Promise<void>{
    await this.api.post(event._actions.unpublish);
    this.toastService.toast("Vráceno do připravovaných akcí.");
    this.reload();
  }

  async cancelEvent(event:Event):Promise<void>{
    await this.api.post(event._actions.cancel);
    this.toastService.toast("Akce je nyní v programu jako zrušená.");
    this.reload();
  }
  async uncancelEvent(event:Event):Promise<void>{
    await this.api.post(event._actions.uncancel);
    this.toastService.toast("Zrušení akce bylo zrušeno.");
    this.reload();
  }

}
