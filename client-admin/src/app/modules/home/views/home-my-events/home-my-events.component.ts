import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "app/core/services/api.service";

import { Event } from "app/schema/event";
import { DateTime } from 'luxon';

type DashboardMyEventsStats = {
  count: number,
  days: number,
  mandays: number;
};

@Component({
  selector: 'bo-home-my-events',
  templateUrl: './home-my-events.component.html',
  styleUrls: ['./home-my-events.component.scss'],
})
export class HomeMyEventsComponent implements OnInit {

  @Input() limit?: number;

  title = "Moje akce";

  events: Event[] = [];

  stats: DashboardMyEventsStats = {
    count: 0,
    days: 0,
    mandays: 0
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.loadMyEvents();
  }

  async loadMyEvents() {

    this.events = await this.api.get<Event[]>("me:events");

    this.events.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));

    if (this.limit) this.events = this.events.slice(0, this.limit);

    this.updateStats();

  }

  updateStats() {
    this.stats = this.events.reduce((stats, event) => {

      stats.count++;

      const dateFrom = DateTime.fromISO(event.dateFrom).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const dateTill = DateTime.fromISO(event.dateTill).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).plus({ days: 1 });

      const days = dateTill.diff(dateFrom, "days").days;

      stats.days += days;

      stats.mandays += days * (event.attendees?.length || 0);

      return stats;

    }, { count: 0, days: 0, mandays: 0 });

  }

  openLeadEventModal() {
    this.router.navigate(["akce/vest-akci"], { relativeTo: this.route });
  }


}
