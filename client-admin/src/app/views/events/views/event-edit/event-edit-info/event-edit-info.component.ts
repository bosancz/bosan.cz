import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { EventsService } from '../../../services/events.service';

import { Event } from 'app/shared/schema/event';
import { map } from 'rxjs/operators';
import { Member } from 'app/shared/schema/member';

@Component({
  selector: 'event-edit-info',
  templateUrl: './event-edit-info.component.html',
  styleUrls: ['./event-edit-info.component.scss']
})
export class EventEditInfoComponent implements OnInit {

  event$ = this.eventsService.event$;

  leaders$ = this.event$.pipe(map(event => event?.leaders?.map(leader => leader._id) || []));

  members: Member[] = [];

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadMembers();
  }

  async loadMembers() {
    const options = {
      // role: "vedoucí",
      inactive: false,
      sort: "group -role nickname"
    };

    this.members = await this.api.get<Member[]>("members", options);
  }

  async saveEvent(event: Event, ngForm: NgForm) {

    await this.api.patch<Event>(event._links.self, ngForm.value);
    this.toastService.toast("Uloženo.")

    this.eventsService.loadEvent(event._id);
  }

}
