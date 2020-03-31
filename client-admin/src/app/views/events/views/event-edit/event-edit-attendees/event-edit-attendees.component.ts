import { Component, OnInit } from '@angular/core';

import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'event-edit-attendees',
  templateUrl: './event-edit-attendees.component.html',
  styleUrls: ['./event-edit-attendees.component.scss']
})
export class EventEditAttendeesComponent implements OnInit {

  event$ = this.eventService.event$;

  constructor(private eventService: EventsService) { }

  ngOnInit() {
  }

}
