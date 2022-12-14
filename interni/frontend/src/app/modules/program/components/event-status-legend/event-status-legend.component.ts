import { Component, OnInit } from '@angular/core';
import { EventStatuses } from 'app/config/event-statuses';

@Component({
  selector: 'bo-event-status-legend',
  templateUrl: './event-status-legend.component.html',
  styleUrls: ['./event-status-legend.component.scss']
})
export class EventStatusLegendComponent implements OnInit {

  statuses = EventStatuses;

  constructor() { }

  ngOnInit(): void {
  }

}
