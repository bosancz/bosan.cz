import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.scss']
})
export class MyEventComponent implements OnInit, OnDestroy {

  event:Event;
  
  edit = {
    report: false
  };
  
  paramsSubscription:Subscription;
  
  constructor(private api:ApiService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.loadEvent(params.akce);
    });
  }
  
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadEvent(eventId:string) {
    this.event = await this.api.get<Event>(["event",eventId],{populate:["leaders"]});
  }
}
