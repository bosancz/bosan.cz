import { Component, OnInit } from '@angular/core';
import { ApiService } from "app/core/services/api.service";
import { Event } from 'app/schema/event';
import { DateTime } from 'luxon';




@Component({
  selector: 'bo-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {

  myEvents: Event[] = [];
  noLeaderEvents: Event[] = [];

  constructor(
    private api: ApiService
  ) { }


  ngOnInit() {
    this.loadMyEvents();
  }

  async loadMyEvents() {
    this.myEvents = await this.api.get<Event[]>("me:events");
    this.myEvents.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));
  }


}
