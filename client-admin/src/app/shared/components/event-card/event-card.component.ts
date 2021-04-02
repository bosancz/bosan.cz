import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'app/shared/schema/event';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { DocumentAction } from 'app/shared/schema/api';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input()
  event?: Event;

  @Input()
  set eventId(eventId: string) {
    this.loadEvent(eventId);
  }

  @Input()
  actions: boolean = true;

  @Output()
  change = new EventEmitter<Event>();

  constructor(private api: ApiService, private toastService: ToastService) { }

  ngOnInit() {
  }

  async loadEvent(eventId: string) {
    this.event = await this.api.get<Event>(["event", eventId]);
  }

  async reload() {
    if (this.event && this.event._id) return this.loadEvent(this.event._id);
  }

  async eventAction(action: DocumentAction, note: boolean = false) {

    if (note) {
      const note = window.prompt("Poznámka k vrácení akce:");

      // hit cancel in the prompt cancels the action
      if (note === null) return;

    }

    await this.api.post(action, { note: note || undefined });

    await this.reload();
    this.change.emit(this.event);

  }

}
