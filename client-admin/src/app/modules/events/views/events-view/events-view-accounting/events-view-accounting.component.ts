import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event } from 'app/schema/event';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-accounting',
  templateUrl: './events-view-accounting.component.html',
  styleUrls: ['./events-view-accounting.component.scss']
})
export class EventsViewAccountingComponent implements OnInit {

  event?: Event;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.eventsService.event$
      .pipe(untilDestroyed(this))
      .subscribe(event => this.event = event);
  }

}
