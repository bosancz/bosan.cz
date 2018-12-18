import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";
import { DateTime } from "luxon";

import { ApiService } from "app/services/api.service";
import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";

@Component({
  selector: 'event-admin-info',
  templateUrl: './event-admin-info.component.html',
  styleUrls: ['./event-admin-info.component.css']
})
export class EventAdminInfoComponent implements OnInit {

  event:any;
  
  @Input("event") 
  set setEvent(event:Event){
    this.event = JSON.parse(JSON.stringify(event));
    const dateFrom = DateTime.fromISO(this.event.dateFrom);
    const dateTill = DateTime.fromISO(this.event.dateTill);
    this.event.dateFrom = dateFrom.toISODate();
    this.event.dateTill = dateFrom.toISODate();
    this.event.timeFrom = dateTill.toISOTime({includeOffset:false});
    this.event.timeTill = dateTill.toISOTime({includeOffset:false});
    this.setAllDay(this.event.allDay);
  }

  @Output() saved:EventEmitter<void> = new EventEmitter();

  leaders:Member[] = [];

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

  async loadConfig(){

    const config = await this.configService.getConfig();
    
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
    
    // merge date and time to date
    eventData.dateFrom = DateTime.fromISO(this.event.dateFrom + "T" + (this.event.timeFrom || "00:00")).setZone("Europe/Prague").toISO();
    eventData.dateTill = DateTime.fromISO(this.event.dateTill + "T" + (this.event.timeTill || "00:00")).setZone("Europe/Prague").toISO();
    delete eventData.timeFrom;
    delete eventData.timeTill;
    
    await this.api.patch(this.event._links.self,eventData);
    
    this.toastService.toast("Uloženo.");
    this.saved.emit();
  }

  checkDescription(description:string):void{
    this.descriptionWarnings = this.descriptionWarningDefs.filter(warning => warning.regexp.test(description)).map(warning => warning.text);
  }
  
  setAllDay(status:boolean){
    
    if(status){
      this.event.timeFrom = undefined;
      this.event.timeTill = undefined;
    }
    else{
      this.event.timeFrom = "00:00:00";
      this.event.timeTill = "00:00:00";
    }
      
    
    this.allDay = status;
  }
  
}
