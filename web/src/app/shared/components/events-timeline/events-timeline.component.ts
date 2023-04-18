import { Component, Input, OnInit } from "@angular/core";

import { ApiService } from "app/services/api.service";

import { Event } from "app/shared/schema/event";

@Component({
  selector: "events-timeline",
  templateUrl: "events-timeline.component.html",
  styleUrls: ["events-timeline.component.scss"],
})
export class EventsTimelineComponent implements OnInit {
  @Input() limit: number;

  @Input() groupsFilter: boolean;

  @Input() full: boolean = false;

  events: Event[] = [];

  loading: boolean = false;

  private months = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;

    this.events = await this.api.get<Event[]>("program", { limit: this.limit || undefined });

    this.events.forEach((event) => event.groups.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));

    this.loading = false;
  }

  getEventRegistrationUrl(event: Event): string {
    return this.api.link2href(event._links.registration);
  }

  getMonth(date: Date | string) {
    const i = new Date(date).getMonth();
    return this.months[i];
  }
}
