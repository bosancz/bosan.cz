import { Component, Input, OnChanges, EventEmitter, Output, HostBinding } from '@angular/core';
import { DateTime } from 'luxon';
import { Event } from 'app/shared/schema/event';
import { Member } from 'app/shared/schema/member';
import { GroupPipe, GroupPipeProperty } from 'app/shared/pipes/group.pipe';

@Component({
  selector: 'event-attendees-list-item',
  templateUrl: './event-attendees-list-item.component.html',
  styleUrls: ['./event-attendees-list-item.component.scss'],
  host: {
    class: ""
  }
})
export class EventAttendeesListItemComponent implements OnChanges {

  @Input() member: Member;
  @Input() event: Event;
  @Input() editable: boolean = false;

  @Output() remove: EventEmitter<void> = new EventEmitter();

  @HostBinding('style.color') public groupColor: string;

  hasBirthday: boolean = false;
  ageEnd: number;
  ageStart: number;

  isInvalid: boolean = false;
  invalidString: string;

  infoString: string;

  constructor(private groupPipe: GroupPipe) { }

  ngOnChanges() {

    if (!this.member) {
      this.hasBirthday = false;
      this.ageEnd = undefined;
      this.ageStart = undefined;
      this.isInvalid = true;
      this.invalidString = "Účastník neexistuje";
      this.infoString = undefined;
      this.groupColor = undefined;
    }

    this.groupColor = this.groupPipe.transform(this.member.group, "color" as GroupPipeProperty);

    if (this.event && this.event.dateFrom && this.event.dateTill && this.member.birthday) {
      const dateFrom = DateTime.fromISO(this.event.dateFrom).set({ hour: 0, minute: 0 });
      const dateTill = DateTime.fromISO(this.event.dateTill).set({ hour: 23, minute: 59 });

      const ageStart = Math.floor((-1) * DateTime.fromISO(this.member.birthday).diff(dateFrom, "years").toObject().years);
      const ageEnd = Math.floor((-1) * DateTime.fromISO(this.member.birthday).diff(dateTill, "years").toObject().years);

      this.hasBirthday = ageStart < ageEnd;
      this.ageEnd = ageEnd;
      this.ageStart = ageStart;
    }
    else {
      this.hasBirthday = false;
      this.ageEnd = undefined;
      this.ageStart = undefined;
    }

    const invalidMessages = [];
    if (!this.member.name || !this.member.name.first || !this.member.name.last || !this.member.birthday) invalidMessages.push("Chybí údaje v členské databázi");
    this.isInvalid = !!invalidMessages.length;
    this.invalidString = invalidMessages.join(", ");

    const infoString = [];
    if (this.member.name && (this.member.name.first || this.member.name.last)) infoString.push((this.member.name.first || "") + " " + (this.member.name.last || ""));
    if (this.member.group) infoString.push(this.groupPipe.transform(this.member.group, "name" as GroupPipeProperty));
    //if (this.member.role) infoString.push(this.member.role);
    this.infoString = infoString.join(", ");

  }
}
