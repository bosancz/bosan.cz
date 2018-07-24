import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { Event } from "../../../schema/event";
import { Member } from "../../../schema/member";

@Component({
  selector: 'event-admin-info',
  templateUrl: './event-admin-info.component.html',
  styleUrls: ['./event-admin-info.component.css']
})
export class EventAdminInfoComponent implements OnInit {

  @Input() event:Event;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  leaders:Member[] = [];
  
  constructor() { }

  ngOnInit() { }
  
  saveEvent(eventForm:NgForm){
    this.save.emit(eventForm.value);
  }

}
