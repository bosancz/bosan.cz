import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';

import { EventsService } from 'app/views/events/services/events.service';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';

import { Event } from 'app/shared/schema/event';
import { Member } from 'app/shared/schema/member';

@Component({
  selector: 'bo-event-edit-leaders',
  templateUrl: './event-edit-leaders.component.html',
  styleUrls: ['./event-edit-leaders.component.scss']
})
export class EventEditLeadersComponent implements OnInit {

  event$ = this.eventsService.event$;
  leaders$ = this.event$.pipe(map(event => event?.leaders?.map(leader => leader._id) || []));

  members: Member[] = [];

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
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

  async save(event: Event, form: NgForm) {

    const data = form.value;

    await this.api.patch(event._links.self, data);

    await this.eventsService.loadEvent(event._id);

    this.toastService.toast("Uloženo.");
  }

}
