import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { DateTime } from 'luxon';

import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';
import { ProgramService } from '../../services/program.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'program-workflow',
  templateUrl: './program-workflow.component.html',
  styleUrls: ['./program-workflow.component.scss']
})
export class ProgramWorkflowComponent implements OnInit {

  selectedColumn = "pending";

  events = new BehaviorSubject<undefined | Event[]>([]);

  noLeaderEvents = this.events.pipe(map(events => events?.filter(event => ['draft', 'rejected'].indexOf(event.status) !== -1 && (!event.leaders || !event.leaders.length))));
  draftEvents = this.events.pipe(map(events => events?.filter(event => ['draft', 'rejected'].indexOf(event.status) !== -1 && event.leaders && event.leaders.length)));
  pendingEvents = this.events.pipe(map(events => events?.filter(event => event.status === "pending")));
  publicEvents = this.events.pipe(map(events => events?.filter(event => ['public', 'cancelled'].indexOf(event.status) !== -1)));

  loading: boolean = true;

  constructor(
    private api: ApiService,
    private programService: ProgramService
  ) {

  }

  ngOnInit() {
    this.loadEvents();
    this.pendingEvents
      .pipe(untilDestroyed(this))
      .pipe(filter(events => events !== undefined))
      .subscribe(events => this.programService.pendingEventsCount.next(events!.length));
  }

  async loadEvents() {

    this.loading = true;

    const options = {
      limit: 100,
      filter: {
        dateFrom: { $gte: DateTime.local().toISODate() }
      },
      sort: "dateFrom",
      select: "_id status statusNote name description dateFrom dateTill leaders subtype"
    };

    const events = await this.api.get<Event[]>("events", options);

    this.events.next(events);

    this.loading = false;
  }

  eventChanged(newEvent: Event) {
    const events = this.events.value || [];
    const i = events.findIndex(event => event._id === newEvent._id);
    if (i >= 0) {
      events.splice(i, 1, newEvent);
    }
    else {
      events.push(newEvent);
    }
    this.events.next(events);
  }

}
