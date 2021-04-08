import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventStatuses } from "app/config/statuses";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";
import { Event } from "app/schema/event";
import { EventStatus } from 'app/schema/event-status';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { filter } from 'rxjs/operators';
import { EventsService } from '../../services/events.service';


@UntilDestroy()
@Component({
  selector: 'bo-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss'],
})
export class EventsViewComponent implements OnInit {

  event?: Event;
  eventStatus?: EventStatus;

  actions: Action[] = [];

  view: "event" | "attendees" | "accounting" | "registration" | "report" = "event";

  statuses = EventStatuses;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe((params: Params) => {
        this.loadEvent(params.event);
      });

    this.eventsService.event$
      .pipe(filter(event => !!event))
      .subscribe(event => this.updateEvent(event!));
  }

  async loadEvent(eventId: string) {
    await this.eventsService.loadEvent(eventId);
  }
  async updateEvent(event: Event) {
    this.event = event;
    this.eventStatus = EventStatuses[event.status];
  }

}
