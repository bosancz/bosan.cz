import { Component, Input } from '@angular/core';
import { DateTime } from "luxon";

import { Event } from "app/schema/event";

@Component({
  selector: 'event-age-histogram',
  templateUrl: './event-age-histogram.component.html',
  styleUrls: ['./event-age-histogram.component.scss']
})
export class EventAgeHistogramComponent {

  @Input() min: number = 7;
  @Input() max: number = 18;

  countMax?: number;

  histogram: Array<{ age: number, count: number; }> = [];

  constructor() { }

  @Input()
  set event(event: Event) {
    this.updateAges(event);
  }

  updateAges(event: Event): void {
    const members = event.attendees || [];

    const ages: { [age: string]: number; } = {};
    var countMax = 0;

    const dateFrom = DateTime.fromISO(event.dateFrom).set({ hour: 0 });
    const dateTill = DateTime.fromISO(event.dateTill).set({ hour: 23, minute: 59 });

    members.forEach(member => {
      if (!member.birthday) return;

      var age = Math.floor((-1) * DateTime.fromISO(member.birthday).diff(dateFrom, "years").toObject().years!);

      age = Math.max(this.min, Math.min(this.max, age));

      ages[age] = ages[age] ? ages[age] + 1 : 1;
      countMax = Math.max(countMax, ages[age]);
    });

    this.countMax = countMax;

    this.histogram = [];
    for (let i = this.min; i <= this.max; i++) this.histogram.push({ age: i, count: ages[i] || 0 });

  }

}
