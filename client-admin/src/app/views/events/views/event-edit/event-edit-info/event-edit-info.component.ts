import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { EventsService } from '../../../services/events.service';

import { Event } from 'app/shared/schema/event';

@Component({
  selector: 'event-edit-info',
  templateUrl: './event-edit-info.component.html',
  styleUrls: ['./event-edit-info.component.scss']
})
export class EventEditInfoComponent implements OnInit {

  event$ = this.eventsService.event$;

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }

  async saveEvent(event: Event, ngForm: NgForm) {

    await this.api.patch<Event>(event._links.self, ngForm.value);
    this.toastService.toast("Uloženo.")

    this.eventsService.loadEvent(event._id);
  }

}
