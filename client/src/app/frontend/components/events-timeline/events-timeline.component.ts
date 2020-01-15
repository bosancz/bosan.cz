import { Component, OnInit, Input } from '@angular/core';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";
import { WebConfigEventType, WebConfigEventSubType } from "app/shared/schema/webconfig";

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.component.html",
  styleUrls: ["events-timeline.component.scss"]
})
export class EventsTimelineComponent implements OnInit {

  @Input() limit: number;

  @Input() groupsFilter: boolean;

  @Input() full: boolean = false;

  events: Event[] = [];

  loading: boolean = false;

  constructor(private api: ApiService, private configService: ConfigService, private toastService: ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {

    this.loading = true;

    this.events = await this.api.get<Event[]>("program", { limit: this.limit || undefined });

    this.events.forEach(event => event.groups.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));

    this.loading = false;

  }

  getEventRegistrationUrl(event: Event): string {
    return this.api.link2href(event._links.registration);
  }
}
