import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { ApiService } from 'app/core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'app/admin/services/toast.service';
import { Event } from 'app/shared/schema/event';

@Component({
  selector: 'events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent implements OnInit {

  event: Event;

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

  async loadEvent(eventId: string) {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.days = DateTime.fromISO(event.dateTill).diff(DateTime.fromISO(event.dateFrom), "days").days + 1;

    this.event = event;

  }

}
