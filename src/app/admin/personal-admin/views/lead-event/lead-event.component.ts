import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'lead-event',
  templateUrl: './lead-event.component.html',
  styleUrls: ['./lead-event.component.scss']
})
export class LeadEventComponent implements OnInit {

  events:Event[];
  
  constructor(private api:ApiService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents(){
    this.events = await this.api.get<Event[]>("events:noleader");
  }
  
  async leadEvent(event:Event){
    await this.api.post(event._actions.lead);
    this.loadEvents();
    this.toastService.toast("Po náročném výběrovém řízení jsi byl/a zvolen/a vedoucím této akce. Akci najdeš v záložce Moje akce.");
  }

}
