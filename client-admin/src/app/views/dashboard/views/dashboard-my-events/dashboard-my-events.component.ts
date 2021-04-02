import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "app/services/api.service";

import { Event } from "app/shared/schema/event";
import { DateTime } from 'luxon';

type DashboardMyEventsStats = {
  count: number,
  days: number,
  mandays: number;
};

@Component({
  selector: 'my-events',
  templateUrl: './dashboard-my-events.component.html',
  styleUrls: ['./dashboard-my-events.component.scss'],
})
export class DashboardMyEventsComponent implements OnInit {

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

    this.updateStats();

  }

  updateStats() {
    this.stats = this.events.reduce((stats, event) => {

      stats.count++;

      const days = Math.ceil(DateTime.fromISO(event.dateTill).diff(DateTime.fromISO(event.dateFrom), "days").days);
      stats.days += days;

      stats.mandays += days * (event.attendees?.length || 0);

      return stats;

    }, { count: 0, days: 0, mandays: 0 });

  }

  openLeadEventModal() {
    this.router.navigate(["akce/vest-akci"], { relativeTo: this.route });
  }


}
