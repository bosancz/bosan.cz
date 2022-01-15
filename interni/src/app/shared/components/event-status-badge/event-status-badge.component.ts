import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event } from "app/schema/event";



@Component({
  selector: 'bo-event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventStatusBadgeComponent {

  @Input() event!: Event;

  constructor() { }
}
