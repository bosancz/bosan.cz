import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ApiService } from "app/core/services/api.service";

import { Event } from "app/shared/schema/event";
import { LeadEventModalComponent } from 'app/admin/components/lead-event-modal/lead-event-modal.component';

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events: Event[] = [];

  leadEventModalRef: BsModalRef;

  constructor(private api: ApiService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.loadMyEvents();
  }

  async loadMyEvents() {

    this.events = await this.api.get<Event[]>("me:events");

    this.events.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));

  }

  openLeadEventModal() {
    this.leadEventModalRef = this.modalService.show(LeadEventModalComponent, { class: 'modal-lg' });
  }


}
