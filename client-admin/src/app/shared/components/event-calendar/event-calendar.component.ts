import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { CzechHolidays } from 'czech-holidays';

import { ConfigService } from 'app/services/config.service';
import { ApiService } from 'app/services/api.service';

import { CPVEvent } from 'app/shared/schema/cpv-event';
import { Event } from 'app/shared/schema/event';
import { WebConfigEventStatus } from 'app/shared/schema/web-config';

const months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

class CalendarMonth {

  days: CalendarDay[] = [];

  blocks = {
    own: new CalendarMonthBlock<Event>(),
    cpv: new CalendarMonthBlock<CPVEvent>()
  };

  name: string;

  constructor(public number: number, public year: number) {
    this.name = months[number - 1];

  }
}

class CalendarMonthBlock<T extends (CPVEvent | Event)> {
  events: CalendarEvent<T>[] = [];
  levels: number = 1;
}

class CalendarDay {
  eventCount: number = 0;
  constructor(public date: DateTime, public isHoliday: boolean) { }
}

class CalendarEvent<T extends (CPVEvent | Event)> {
  level?: number = 0;

  dateFrom: DateTime;
  dateTill: DateTime;

  constructor(public event: T) {
    this.dateFrom = DateTime.fromISO(event.dateFrom).set({ hour: 0, minute: 0 });
    this.dateTill = DateTime.fromISO(event.dateTill).set({ hour: 0, minute: 0 });
  }
}

@Component({
  selector: 'event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit, OnChanges {

  calendar: CalendarMonth[] = [];

  selectedDates?: [DateTime, DateTime];

  @Input() dateFrom!: DateTime;
  @Input() dateTill!: DateTime;

  @Input() events: Event[] = [];

  @Input() cpv: boolean = false;
  @Input() selection: boolean = false;
  @Input() headingLevel: number = 3;

  @Output() select = new EventEmitter<[DateTime, DateTime]>();

  eventsCPV: CPVEvent[] = [];

  statuses: WebConfigEventStatus[] = [];

  eventHeight = 22;

  constructor(
    private api: ApiService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.loadStatuses();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.cpv) {
      if (this.cpv) this.loadEventsCPV();
      else this.eventsCPV = [];
    }

    if (changes.dateFrom || changes.dateTill) {
      this.createCalendar();
      if (this.events) this.assignEvents(this.events, "own");
      if (this.eventsCPV) this.assignEvents(this.eventsCPV, "cpv");
    }

    if (changes.events) {
      this.assignEvents(this.events, "own");
    }
  }

  async loadStatuses() {
    const config = await this.configService.getConfig();
    this.statuses = config.events.statuses;
  }

  createCalendar() {

    let currentDate = this.dateFrom;
    let month = new CalendarMonth(currentDate.month, currentDate.year);
    let holidays = CzechHolidays(currentDate.year);

    const calendar = [month];

    while (currentDate <= this.dateTill) {

      if (currentDate.month !== month.number) {
        month = new CalendarMonth(currentDate.month, currentDate.year);
        calendar.push(month);
      }

      if (currentDate.year !== month.year) holidays = CzechHolidays(currentDate.year);

      const isHoliday = holidays.some(date => date.m === currentDate.month && date.d === currentDate.day);

      month.days.push(new CalendarDay(currentDate, isHoliday));

      currentDate = currentDate.plus({ days: 1 });
    }

    this.calendar = calendar;
  }

  async loadEventsCPV() {
    this.eventsCPV = [];

    this.api.get<CPVEvent[]>("cpv")
      .then(events => {
        this.eventsCPV.push(...events);
        this.assignEvents(this.eventsCPV, "cpv");
      });
  }

  assignEvents(events: Array<Event>, type: "own"): void;
  assignEvents(events: Array<CPVEvent>, type: "cpv"): void;
  assignEvents(events: Array<CPVEvent | Event>, type: "own" | "cpv"): void {

    if (!this.calendar) return;
    if (!events) return;

    this.calendar.forEach(month => {

      // get the monthBlock to which we assign
      const monthBlock = month.blocks[type];

      // assign events based on first and last day, convert to CalendarEvent
      const monthStart = month.days[0].date;
      const monthEnd = month.days[month.days.length - 1].date;
      monthBlock.events = events
        .map(event => new CalendarEvent(event))
        .filter(event => event.dateTill >= monthStart && event.dateFrom <= monthEnd);

      monthBlock.events.sort((a, b) => a.dateFrom.diff(b.dateFrom).valueOf());

      const eventCounts = month.days.map(() => 0);

      monthBlock.events.forEach(event => {

        for (let date = event.dateFrom; date <= event.dateTill; date = date.plus({ days: 1 })) {

          if (date.month === month.number) {
            event.level = Math.max(event.level || 0, eventCounts[date.day - 1]);
            eventCounts[date.day - 1] = event.level + 1;
          }
        }

      });

      monthBlock.levels = Math.max(...eventCounts);
    });



  }

  isWeekend(day: CalendarDay): boolean {
    return day.date.weekday >= 6;
  }

  isHoliday(year: number, day: CalendarDay): boolean {
    return CzechHolidays(year).some(date => date.m === day.date.month && date.d === day.date.day);
  }

  isSelected(day: CalendarDay) {
    return this.selection && this.selectedDates && (day.date >= this.selectedDates[0] && day.date <= this.selectedDates[1]);
  }

  setEventStart(day: CalendarDay) {
    this.selectedDates = [day.date, day.date];
  }

  setEventEnd(day: CalendarDay) {
    if (this.selectedDates) this.selectedDates[1] = day.date;
  }

  emitSelected() {
    if (!this.selection) return;
    this.selectedDates?.sort();
    this.select.emit(this.selectedDates);
  }

  getEventLeft(event: CalendarEvent<CPVEvent | Event>, month: CalendarMonth) {
    return event.dateFrom.diff(month.days[0].date, "days").days / month.days.length;
  }

  getEventWidth(event: CalendarEvent<CPVEvent | Event>, month: CalendarMonth) {
    return (event.dateTill.diff(event.dateFrom, "days").days + 1) / month.days.length;
  }

  getEventClass(event: Event): string {
    const status = this.statuses.find(status => status.id === event.status);
    return status ? "bg-" + status.class : "bg-secondary";
  }

  getEventTooltip(event: Event): string {
    return event.name;
  }

}
