import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

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

  @Input("event") event:Event;

  @Output() saved:EventEmitter<void> = new EventEmitter();

  leaders:Member[] = [];

  eventTypes:string[] = [];
  eventSubTypes:string[] = [];

  descriptionWarnings:string[] = [];
  descriptionWarningDefs:Array<{regexp:RegExp,text:string}> = [];

  constructor(private api:ApiService, private configService:ConfigService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(){
    
    this.configService.getConfig().then(config => {
      
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
      
    });
  }

  async saveEvent(eventForm:NgForm){
    await this.api.patch(this.event._links.self,eventForm.value);
    this.toastService.toast("Uloženo.");
    this.saved.emit();
  }

  checkDescription(description:string):void{
    this.descriptionWarnings = this.descriptionWarningDefs.filter(warning => warning.regexp.test(description)).map(warning => warning.text);
  }

}
