import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "app/services/api.service";

import { Event } from "app/shared/schema/event";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],    
})
export class MyEventsComponent implements OnInit {

  title = "Moje akce";

  events: Event[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.loadMyEvents();
  }

  async loadMyEvents() {

    this.events = await this.api.get<Event[]>("me:events");

    this.events.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));

  }

  openLeadEventModal() {
    this.router.navigate(["akce/vest-akci"], { relativeTo: this.route });
  }


}
