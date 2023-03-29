import { Component, Input } from '@angular/core';
import { DateTime } from "luxon";

import { Event, EventExpense } from "app/schema/event";
import { Member } from "app/schema/member";

@Component({
  selector: 'event-birthday-list',
  templateUrl: './event-birthday-list.component.html',
  styleUrls: ['./event-birthday-list.component.scss']
})
export class EventBirthdayListComponent {

  birthdays: Array<{ age: number, date: string, member: Member; }> = [];

  constructor() { }

  @Input()
  set event(event: Event) {
    this.updateBirthdays(event);
  }

  updateBirthdays(event: Event) {
    const members = [];
    if (event.leaders) members.push(...event.leaders);
    if (event.attendees) members.push(...event.attendees);

    this.birthdays = [];

    const dateFrom = DateTime.fromISO(event.dateFrom).set({ hour: 0, minute: 0 });
    const dateTill = DateTime.fromISO(event.dateTill).set({ hour: 23, minute: 59 });

    members.forEach(member => {
      if (!member.birthday) return;
      var ageStart = Math.floor((-1) * DateTime.fromISO(member.birthday).diff(dateFrom, "years").toObject().years!);
      var ageEnd = Math.floor((-1) * DateTime.fromISO(member.birthday).diff(dateTill, "years").toObject().years!);
      if (ageStart < ageEnd) this.birthdays.push({ age: ageEnd, date: member.birthday, member: member });
    });
  }

}
