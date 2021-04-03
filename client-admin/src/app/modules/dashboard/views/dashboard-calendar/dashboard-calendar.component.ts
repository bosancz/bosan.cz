import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';
import { DateTime } from 'luxon';

@Component({
  selector: 'dashboard-calendar',
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.scss']
})
export class DashboardCalendarComponent implements OnInit {

  events: Event[] = [];

  eventsDateFrom = DateTime.local().set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
  eventsDateTill = this.eventsDateFrom.plus({ months: 5, days: -1 });

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    const options: any = {
      sort: "dateFrom",
    };

    options.filter = {
      dateTill: { $gte: this.eventsDateFrom.toISODate() },
      dateFrom: { $lte: this.eventsDateTill.toISODate() }
    };

    this.events = await this.api.get<Event[]>("events", options);
  }

}
