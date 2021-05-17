import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-report',
  templateUrl: './events-view-report.component.html',
  styleUrls: ['./events-view-report.component.scss']
})
export class EventsViewReportComponent implements OnInit {

  event?: Event;

  actions: Action[] = [

  ];

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.eventsService.event$
      .pipe(untilDestroyed(this))
      .subscribe(event => this.event = event);
  }

}
