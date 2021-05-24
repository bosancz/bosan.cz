import { Component, OnInit } from '@angular/core';
import { ApiService } from "app/core/services/api.service";
import { Event } from 'app/schema/event';
import { DateTime } from 'luxon';




@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  calendarDateFrom = DateTime.local();
  calendarDateTill = DateTime.local().plus({ months: 1 });
  calendarEvents: Event[] = [];

  myEvents: Event[] = [];
  noLeaderEvents: Event[] = [];

  constructor(
    private api: ApiService
  ) { }


  ngOnInit() {
    this.loadMyEvents();
    this.loadNoLeaderEvents();
    this.loadCalendarEvents();
  }

  async loadMyEvents() {
    this.myEvents = await this.api.get<Event[]>("me:events");
    this.myEvents.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));
  }

  async loadNoLeaderEvents() {
    this.noLeaderEvents = await this.api.get<Event[]>("events:noleader", { sort: "dateFrom" });
  }

  async loadCalendarEvents() {
    const options: any = {
      sort: "dateFrom",
    };

    options.filter = {
      dateTill: { $gte: this.calendarDateFrom.toISODate() },
      dateFrom: { $lte: this.calendarDateTill.toISODate() }
    };

    this.calendarEvents = await this.api.get<Event[]>("events", options);
  }

}
