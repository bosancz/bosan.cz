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

  birthdays:Array<{age:number,member:Member}> = [];
  
  constructor() { }

  @Input()
  set event(event:Event){
    this.updateBirthdays(event);
  }
  
  updateBirthdays(event:Event){
    const members = [...event.leaders,...event.attendees];
    
    this.birthdays = [];
    
    const dateFrom = DateTime.fromISO(event.dateFrom).set({hour:0,minute:0});
    const dateTill = DateTime.fromISO(event.dateTill).set({hour:23,minute:59});
    
    members.forEach(member => {
      var ageStart = Math.floor( (-1) * DateTime.fromISO(member.birthday).diff(dateFrom,"years").toObject().years );
      var ageEnd = Math.floor( (-1) * DateTime.fromISO(member.birthday).diff(dateTill,"years").toObject().years );
      if(ageStart < ageEnd) this.birthdays.push({ age: ageEnd, member: member });
    });
  }

}
