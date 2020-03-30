import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { EventsService } from '../../services/events.service';

@Component({
  selector: 'event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit, OnDestroy {

  event$ = this.eventsService.event$;

  paramsSubscription = this.route.params
    .pipe(map((params: Params) => params.event))
    .subscribe(eventId => this.eventsService.loadEvent(eventId));

  constructor(private eventsService: EventsService, private route: ActivatedRoute) { }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
