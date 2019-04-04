import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { Event } from "app/shared/schema/event";

@Component({
  selector: 'event-admin-attendees',
  templateUrl: './event-admin-attendees.component.html',
  styleUrls: ['./event-admin-attendees.component.css']
})
export class EventAdminAttendeesComponent implements OnInit {

  @Input() event:Event;
  
  @Output() saved:EventEmitter<void> = new EventEmitter();
  
  constructor(private api:ApiService) { }

  ngOnInit() {
  }
  
    /*
  getAttendeeAge(attendee):number{
    let date = this.event.dateFrom;
    let bd = attendee.birthday;
    
    if(!bd) return;

    let age = date.getFullYear() - bd.getFullYear();

    if(date.getMonth() > bd.getMonth()) return age;
    if(date.getMonth() === bd.getMonth() && date.getDate() >= bd.getDate()) return age;
    return age - 1;
  }*/
  
  isAttendeeBirthday(attendee):boolean{
    return false; // TODO
  }
  
  addAttendee(attendee:any):void{
    this.event.attendees.push(attendee);
  }
  
  removeAttendee(attendee){
    this.event.attendees.splice(this.event.attendees.indexOf(attendee),1);
  }
  
}
