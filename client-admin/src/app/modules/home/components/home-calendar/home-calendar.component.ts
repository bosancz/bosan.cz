import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';
import { DateTime } from 'luxon';

@Component({
  selector: 'bo-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.scss']
})
export class HomeCalendarComponent implements OnInit {

  dateFrom = DateTime.local();
  dateTill = DateTime.local().plus({ months: 1 });

  events: Event[] = [];

  @Input() months: number = 1;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  async loadCalendarEvents() {
    const options: any = {
      sort: "dateFrom",
    };

    this.dateTill = DateTime.local().plus({ months: 1 });

    options.filter = {
      dateTill: { $gte: this.dateFrom.toISODate() },
      dateFrom: { $lte: this.dateTill.toISODate() }
    };

    this.events = await this.api.get<Event[]>("events", options);
  }

}
