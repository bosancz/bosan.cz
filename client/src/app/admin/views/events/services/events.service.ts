import { Injectable } from '@angular/core';
import { Event } from 'app/shared/schema/event';
import { Observable, BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';
import { NgForm } from '@angular/forms';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/admin/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  event$ = new BehaviorSubject<Event>(null);

  constructor(private api: ApiService, private toastService: ToastService) { }

  async loadEvent(eventId: string): Promise<Event> {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.event$.next(event);

    return event;

  }

}
