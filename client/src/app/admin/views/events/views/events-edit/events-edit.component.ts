import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription, Observable, from } from 'rxjs';
import { ApiService } from 'app/core/services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from 'app/admin/services/toast.service';
import { Event } from 'app/shared/schema/event';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent implements OnInit {

  eventId$: Observable<string> = this.route.params
    .pipe(map((params: Params) => params.event));

  event$: Observable<Event> = this.eventId$
    .pipe(distinctUntilChanged())
    .pipe(mergeMap(eventId => from(this.loadEvent(eventId))));

  editable: boolean = false;

  editing: boolean = false;

  days: number;

  paramsSubscription: Subscription;


  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit() {

  }

  async loadEvent(eventId: string): Promise<Event> {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.days = DateTime.fromISO(event.dateTill).diff(DateTime.fromISO(event.dateFrom), "days").days + 1;

    return event;

  }

  async saveEvent(form: NgForm): Promise<void> {

  }

}
