import { Component, OnInit } from '@angular/core';
import { DateTime } from "luxon";

import { ApiService } from "app/core/services/api.service";

import { Dashboard } from "app/shared/schema/dashboard";
import { Event } from 'app/shared/schema/event';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard;

  events: Event[];

  eventsDateFrom = DateTime.local().set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  eventsDateTill = this.eventsDateFrom.plus({ months: 3, days: -1 });

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loadNoLeaderEvents();

    this.loadEvents();
  }

  async loadEvents() {
    const options: any = {
      sort: "dateFrom",
    };

    options.filter = {
      dateTill: { $gte: this.eventsDateFrom.toISODate() },
      dateFrom: { $lte: this.eventsDateTill.toISODate() }
    }

    this.events = await this.api.get<Event[]>("events", options);
  }

  async loadNoLeaderEvents() {
    this.dashboard = await this.api.get<Dashboard>("me:dashboard");
    console.log(this.dashboard);
  }

}
