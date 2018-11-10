import { Component, OnInit, Input } from '@angular/core';
import { trigger, state,  style, animate, transition } from '@angular/animations';

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";
import { WebConfigEventType, WebConfigEventSubType } from "app/schema/webconfig";

class TimelineEvent extends Event {
  appeared?:boolean = false;
}

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.component.html",
  styleUrls: ["events-timeline.component.scss"],
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

  constructor(private api:ApiService, private configService:ConfigService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents(){
    let options = {
      limit: this.limit || undefined,
      days: this.days || undefined
    };

    this.events = await this.api.get<Event[]>("events:upcoming",options);

    // set the apeared variable, wil be true when scrolled into view
    this.events.forEach(event => event.appeared = false);
  }
}
