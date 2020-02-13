import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DateTime } from 'luxon';

import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/shared/schema/event';

@Component({
  selector: 'program-workflow',
  templateUrl: './program-workflow.component.html',
  styleUrls: ['./program-workflow.component.scss']
})
export class ProgramWorkflowComponent implements OnInit {

  selectedColumn = "V přípravě";

  events = new BehaviorSubject<Event[]>([]);

  draftEvents = this.events.pipe(map(events => events.filter(event => ['draft', 'rejected'].indexOf(event.status) !== -1)));
  pendingEvents = this.events.pipe(map(events => events.filter(event => event.status === "pending")));
  publicEvents = this.events.pipe(map(events => events.filter(event => ['public', 'cancelled'].indexOf(event.status) !== -1)));

  loading: boolean = true;

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.loadEvents()
  }

  async loadEvents() {

    this.loading = true;

    const options = {
      limit: 100,
      filter: {
        dateFrom: { $gte: DateTime.local().toISODate() }
      },
      sort: "dateFrom",
      select: "_id status name description dateFrom dateTill leaders subtype"
    };

    const events = await this.api.get<Event[]>("events", options);

    this.events.next(events);

    this.loading = false;
  }

  eventChanged(newEvent: Event) {
    const events = this.events.value;
    const i = events.findIndex(event => event._id === newEvent._id);
    events.splice(i, 1, newEvent);
    this.events.next(events);
  }

}
