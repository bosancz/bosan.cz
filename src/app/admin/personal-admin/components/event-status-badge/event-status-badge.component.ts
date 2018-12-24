import { Component, Input } from '@angular/core';

import { Event } from "app/schema/event";

@Component({
  selector: 'event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss']
})
export class EventStatusBadgeComponent {

  @Input() event:Event;
  
  constructor() { }

}
