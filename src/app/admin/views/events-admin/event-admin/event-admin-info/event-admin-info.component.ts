import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from "../../../../../services/data.service";

import { Event } from "../../../../../schema/event";
import { Member } from "../../../../../schema/member";

@Component({
  selector: 'event-admin-info',
  templateUrl: './event-admin-info.component.html',
  styleUrls: ['./event-admin-info.component.css']
})
export class EventAdminInfoComponent implements OnInit {

  @Input() event:Event;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  leaders:Member[] = [];
  
  eventTypes:string[] = [];
  eventSubTypes:string[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadEventTypes();
  }
  
  async loadEventTypes(){
    let config = await this.dataService.getConfig();
    this.eventTypes = config.events.types.map(type => type.name);
    this.eventSubTypes = config.events.subtypes.map(type => type.name);
  }
  
  saveEvent(eventForm:NgForm){
    this.save.emit(eventForm.value);
  }

}
