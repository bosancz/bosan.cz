import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/shared/schema/event";
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lead-event-modal',
  templateUrl: './lead-event-modal.component.html',
  styleUrls: ['./lead-event-modal.component.scss']
})
export class LeadEventModalComponent implements OnInit {

  events:Event[];
  
  constructor(private api:ApiService, private toastService:ToastService, public bsModalRef: BsModalRef) { }

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
