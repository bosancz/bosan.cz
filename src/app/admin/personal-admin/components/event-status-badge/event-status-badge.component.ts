import { Component, Input } from '@angular/core';

import { Event } from "app/shared/schema/event";
import { ConfigService } from 'app/core/services/config.service';

interface StatusBadge {
  id:string;
  name:string;
  class:string;
}

@Component({
  selector: 'event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss']
})
export class EventStatusBadgeComponent {

  badge:StatusBadge;

  note:string;

  @Input() set event(event: Event) {
    this.note = event.statusNote;
    this.updateBadge(event);
  }

  constructor(private configService: ConfigService) { }

  async updateBadge(event: Event) {
    const config = await this.configService.getConfig();
    this.badge = config.events.statuses.find(status => status.id === event.status);
  }

}
