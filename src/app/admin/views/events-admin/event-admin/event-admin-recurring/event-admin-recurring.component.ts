import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from "../../../../../schema/event";

@Component({
  selector: 'event-admin-recurring',
  templateUrl: './event-admin-recurring.component.html',
  styleUrls: ['./event-admin-recurring.component.scss']
})
export class EventAdminRecurringComponent implements OnInit {

  @Input() event:Event;
  
  @Output() saved:EventEmitter<void> = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() {
  }

}
