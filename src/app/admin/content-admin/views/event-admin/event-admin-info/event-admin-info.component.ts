import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";
import { DateTime } from "luxon";

import { ApiService } from "app/core/services/api.service";
import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";
import { WebConfigEventStatus } from 'app/shared/schema/webconfig';

@Component({
  selector: 'event-admin-info',
  templateUrl: './event-admin-info.component.html',
  styleUrls: ['./event-admin-info.component.css']
})
export class EventAdminInfoComponent implements OnInit, OnChanges {

  @Input("event") event:Event;

  @Output() saved:EventEmitter<void> = new EventEmitter();

  leaders:Member[] = [];

  eventStatuses:WebConfigEventStatus[] = [];
  eventTypes:string[] = [];
  eventSubTypes:string[] = [];

  descriptionWarnings:string[] = [];
  descriptionWarningDefs:Array<{regexp:RegExp,text:string}> = [];
  
  allDay:boolean = true;

  constructor(private api:ApiService, private configService:ConfigService, private toastService:ToastService) {
  }

  ngOnInit() {
    this.loadConfig();
  }
  
  ngOnChanges(){
    this.allDay = this.event && !this.event.timeFrom && !this.event.timeTill;
  }

  async loadConfig(){

    const config = await this.configService.getConfig();
    
    this.eventStatuses = config.events.statuses;
    this.eventTypes = config.events.types.map(type => type.name);
    this.eventSubTypes = config.events.subtypes.map(type => type.name);

    this.descriptionWarningDefs = config.events.descriptionWarnings.map(warning => {
      try{
        return {regexp:new RegExp(warning.regexp,warning.regexpModifiers),text:warning.text};
      }
      catch(err){
        return undefined; 
      }
    }).filter(item => item !== undefined);
    
    this.checkDescription(this.event.description);

  }

  async saveEvent(eventForm:NgForm){
    
    const eventData = eventForm.value;
    
    eventData.timeFrom = eventData.timeFrom || null;
    eventData.timeTill = eventData.timeTill || null;
    if(!eventData.groups || !eventData.groups.length) eventData.leadersEvent = true;
    
    await this.api.patch(this.event._links.self,eventData);
    
    this.toastService.toast("Uloženo.");
    this.saved.emit();
  }

  checkDescription(description:string):void{
    this.descriptionWarnings = this.descriptionWarningDefs.filter(warning => warning.regexp.test(description)).map(warning => warning.text);
  }  
  
}
