import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding } from '@angular/core';

import { Event } from "app/shared/schema/event";
import { ConfigService } from 'app/core/services/config.service';
import { map, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { WebConfigEventStatus } from 'app/shared/schema/webconfig';

interface StatusBadge {
  id: string;
  name: string;
  class: string;
}

@Component({
  selector: 'event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventStatusBadgeComponent {

  status: string;
  note: string;
  @HostBinding('class') class: string = "badge badge-secondary";

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
        
        this.class = 'badge badge-' + (status ? status.class : 'secondary');
        this.status = status ? status.name : "";
        this.note = event ? event.statusNote : "";

        cdRef.markForCheck();
      });
  }

}
