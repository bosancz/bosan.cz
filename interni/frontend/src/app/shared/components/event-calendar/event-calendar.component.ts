import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { CPVEvent } from 'app/schema/cpv-event';
import { Event } from 'app/schema/event';
import { CzechHolidays } from 'czech-holidays';
import { DateTime } from 'luxon';



const months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

class CalendarRow {

  days: CalendarDay[] = [];

  blocks = {
    own: new CalendarRowBlock<Event>(),
    cpv: new CalendarRowBlock<CPVEvent>()
  };

  constructor(public from: DateTime, public to: DateTime) {
  }
}

class CalendarRowBlock<T extends (CPVEvent | Event)> {
  events: CalendarEvent<T>[] = [];
  levels: number = 1;
}

interface CalendarDayProperties {
  holiday?: boolean;
  empty?: boolean;
  weekend?: boolean;
  oddMonth: boolean;
  today?: boolean;
}
class CalendarDay {
  eventCount: number = 0;
  constructor(public date: DateTime, public properties: CalendarDayProperties) { }
}

class CalendarEvent<T extends (CPVEvent | Event)> {
  level: number = 0;

  dateFrom: DateTime;
  dateTill: DateTime;

  constructor(public event: T) {
    this.dateFrom = DateTime.fromISO(event.dateFrom).set({ hour: 0, minute: 0 });
    this.dateTill = DateTime.fromISO(event.dateTill).set({ hour: 0, minute: 0 });
  }
}

@Component({
  selector: 'bo-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit, OnChanges {

  @Input("dateFrom") set dateFromString(value: DateTime | string) {
    this.dateFrom = typeof value === "string" ? DateTime.fromISO(value) : value;
    this.dateFrom.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  }
  @Input("dateTill") set dateTillString(value: DateTime | string) {
    this.dateTill = typeof value === "string" ? DateTime.fromISO(value) : value;
    this.dateTill.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  }

  @Input() events: Event[] = [];

  @Input() cpv: boolean = false;
  @Input() selection: boolean = false;
  @Input() headingLevel: number = 3;

  @Output() select = new EventEmitter<[DateTime, DateTime]>();

  calendar: CalendarRow[] = [];

  selectedDate?: DateTime;
  hoverDate?: DateTime;

  dateFrom!: DateTime;
  dateTill!: DateTime;

  eventsCPV: CPVEvent[] = [];

  eventHeight = 22;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.cpv) {
      if (this.cpv) this.loadEventsCPV();
      else this.eventsCPV = [];
    }

    if (changes.dateFromString || changes.dateFromString) {
      this.createCalendar();
      if (this.events) this.assignEvents(this.events, "own");
      if (this.eventsCPV) this.assignEvents(this.eventsCPV, "cpv");
    }

    if (changes.events) {
      this.assignEvents(this.events, "own");
    }
  }

  createCalendar() {

    let currentDate = this.dateFrom.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    if (currentDate.weekday > 1) currentDate = currentDate.minus({ days: currentDate.weekday - 1 });

    let dateTill = this.dateTill;
    if (dateTill.weekday < 7) dateTill = dateTill.plus({ days: 7 - dateTill.weekday });

    let holidays = CzechHolidays(currentDate.year);

    let row = new CalendarRow(currentDate, currentDate.plus({ days: 6 }));
    const calendar = [row];

    while (currentDate <= dateTill) {

      if (currentDate > row.to) {
        row = new CalendarRow(currentDate, currentDate.plus({ days: 6 }));
        calendar.push(row);
      }

      if (currentDate.year !== row.to.year) holidays.push(...CzechHolidays(row.to.year));

      const dayInfo = {
        empty: currentDate < this.dateFrom || currentDate > this.dateTill,
        holiday: this.isHoliday(currentDate),
        weekend: this.isWeekend(currentDate),
        oddMonth: (currentDate.month - this.dateFrom.month) % 2 === 0,
        today: this.isToday(currentDate)
      };

      row.days.push(new CalendarDay(currentDate, dayInfo));

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

    this.calendar.forEach(row => {

      // get the monthBlock to which we assign
      const rowBlock = row.blocks[type];

      // assign events based on first and last day, convert to CalendarEvent
      rowBlock.events = events
        .map(event => new CalendarEvent(event))
        .filter(event => event.dateTill >= row.from && event.dateFrom <= row.to);

      rowBlock.events.sort((a, b) => a.dateFrom.diff(b.dateFrom).valueOf());

      const eventCounts = Array(7).fill(0);

      rowBlock.events.forEach(event => {

        for (let date = event.dateFrom; date <= event.dateTill; date = date.plus({ days: 1 })) {

          if (date >= row.from && date <= row.to) {
            event.level = Math.max(event.level, eventCounts[date.weekday - 1] + 1);
            eventCounts[date.weekday - 1] = event.level;
          }
        }

      });

      rowBlock.levels = Math.max(...eventCounts);
    });



  }

  private isWeekend(date: DateTime): boolean {
    return date.weekday >= 6;
  }

  private isHoliday(date: DateTime): boolean {
    return CzechHolidays(date.year).some(item => item.m === date.month && item.d === date.day);
  }

  private isToday(date: DateTime): boolean {
    return date.hasSame(DateTime.now(), 'day');
  }

  isSelectedRange(day: CalendarDay) {
    if (!this.selectedDate || !this.hoverDate) return false;
    const range: [DateTime, DateTime] = [this.selectedDate, this.hoverDate];
    range.sort();
    return (day.date >= range[0] && day.date <= range[1]);
  }

  setSelection(day: CalendarDay) {
    if (!this.selection) return;

    if (this.selectedDate) {
      const range: [DateTime, DateTime] = [this.selectedDate, day.date];
      range.sort();
      this.select.emit(range);
      this.selectedDate = undefined;
    }
    else this.selectedDate = day.date;
  }

  @HostListener('document:keydown.escape')
  clearSelection(event?: MouseEvent) {
    if (this.selectedDate) event?.preventDefault();
    this.selectedDate = undefined;
  }

  setSelectionHover(day: CalendarDay) {
    this.hoverDate = day.date;
  }

  emitSelected() {
    if (!this.selection) return;

  }

  getEventLeft(event: CalendarEvent<CPVEvent | Event>, row: CalendarRow) {
    return event.dateFrom.diff(row.days[0].date, "days").days / row.days.length;
  }

  getEventWidth(event: CalendarEvent<CPVEvent | Event>, month: CalendarRow) {
    return (event.dateTill.diff(event.dateFrom, "days").days + 1) / month.days.length;
  }

  getEventTooltip(event: Event): string {
    return event.name;
  }

}
