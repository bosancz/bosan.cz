import { Component, OnInit, Input } from '@angular/core';
import { trigger, state,  style, animate, transition } from '@angular/animations';

import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";
import { WebConfigEventType, WebConfigEventSubType } from "app/schema/webconfig";

class TimelineEvent extends Event {
  appeared?:boolean = false;
}

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.template.html",
  styleUrls: ["events-timeline.style.scss"],
  animations: [
    trigger("eventWow", [
      transition('notappeared => appeared', [style({opacity:0}),animate('500ms 100ms',style({opacity:1}))])
    ])
  ]
})
export class EventsTimelineComponent implements OnInit {

  @Input() limit:number;
  @Input() days:number;
  
  @Input() groupsFilter:boolean;
  
  @Input() full:boolean = false;
  
  events:TimelineEvent[]= [];
  
  eventTypes:{[s:string]:WebConfigEventType};
  eventSubTypes:{[s:string]:WebConfigEventSubType};
  
  monthNames:string[] = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
    this.loadEventTypes();
  }
  
  async loadEvents(){
    let options = {
      limit: this.limit || undefined,
      days: this.days || undefined
    };
    
    this.events = await this.dataService.getEventsUpcoming(options);

    // set the apeared variable, wil be true when scrolled into view
    this.events.forEach(event => event.appeared = false);
  }
  
  async loadEventTypes(){
    let config = await this.dataService.getConfig();
    this.eventTypes = config.events.types.reduce((acc,cur) => ({...acc, [cur.name]: cur}),{});
    this.eventSubTypes = config.events.subtypes.reduce((acc,cur) => ({...acc, [cur.name]: cur}),{});
  }
  
  getMonthName(date:string|Date){
    return this.monthNames[new Date(date).getMonth()];
  }
}
