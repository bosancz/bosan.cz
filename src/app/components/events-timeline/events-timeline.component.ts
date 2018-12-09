import { Component, OnInit, Input } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";
import { WebConfigEventType, WebConfigEventSubType } from "app/schema/webconfig";

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.component.html",
  styleUrls: ["events-timeline.component.scss"]
})
export class EventsTimelineComponent implements OnInit {

  @Input() limit:number;
  @Input() days:number;

  @Input() groupsFilter:boolean;

  @Input() full:boolean = false;

  events:Event[]= [];
  
  loading:boolean = false;

  constructor(private api:ApiService, private configService:ConfigService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents(){
    
    this.loading = true;
    
    this.events = await this.api.get<Event[]>("program");

    this.loading = false;
    
  }
}
