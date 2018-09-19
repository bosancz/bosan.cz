import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from "app/schema/event";

@Component({
  selector: 'event-admin-attendees',
  templateUrl: './event-admin-attendees.component.html',
  styleUrls: ['./event-admin-attendees.component.css']
})
export class EventAdminAttendeesComponent implements OnInit {

  @Input() event:Event;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }
  
  getAttendeeAge(attendee):number{
    let date = this.event.dateFrom;
    let bd = attendee.birthday;
    
    if(!bd) return;

    var age = date.getFullYear() - bd.getFullYear();

    if(date.getMonth() > bd.getMonth()) return age;
    if(date.getMonth() === bd.getMonth() && date.getDate() >= bd.getDate()) return age;
    return age - 1;
  }
  
  isAttendeeBirthday(attendee):boolean{
    return false; //TODO
  }
  
  addAttendee(attendee:any):void{
    this.event.attendees.push(attendee);
  }
  
  removeAttendee(attendee){
    this.event.attendees.splice(this.event.attendees.indexOf(attendee),1);
  }
  
}
