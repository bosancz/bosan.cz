import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { ConfigService } from 'app/core/services/config.service';

import { Event } from "app/schema/event";

@Component({
  selector: 'event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventStatusBadgeComponent {

  status?: string;
  note?: string;

  @HostBinding('class') class: string = "badge badge-secondary";

  defaultClasses: string = "badge align-top";

  event: Subject<Event> = new Subject();

  @Input("event")
  set setEvent(event: Event) {
    this.event.next(event);
  }

  constructor(configService: ConfigService, cdRef: ChangeDetectorRef) {
    this.event
      .pipe(withLatestFrom(configService.config.pipe(map(config => config.events.statuses))))
      .subscribe(([event, statuses]) => {
        const status = event ? statuses.find(status => status.id === event.status) : null;

        this.class = this.defaultClasses + ' badge-' + (status ? status.class : 'secondary');
        this.status = status ? status.name : "";
        this.note = event ? event.statusNote : "";

        cdRef.markForCheck();
      });
  }

}
