import { Injectable } from '@angular/core';
import { Event } from 'app/shared/schema/event';
import { BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';
import { ApiService } from 'app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  event$ = new BehaviorSubject<Event | null>(null);

  constructor(private api: ApiService) { }

  async loadEvent(eventId: string): Promise<Event> {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees?.sort((a, b) => a.nickname.localeCompare(b.nickname));

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.event$.next(event);

    return event;

  }

}
