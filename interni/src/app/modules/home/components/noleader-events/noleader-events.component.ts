import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';

@Component({
  selector: 'bo-noleader-events',
  templateUrl: './noleader-events.component.html',
  styleUrls: ['./noleader-events.component.scss']
})
export class NoleaderEventsComponent implements OnInit {

  events: Event[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {

    this.loadNoLeaderEvents();
  }

  async loadNoLeaderEvents() {
    this.events = await this.api.get<Event[]>("events:noleader", { sort: "dateFrom" });
  }

}
