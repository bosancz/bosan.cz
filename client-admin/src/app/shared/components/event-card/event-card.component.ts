import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'app/schema/event';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { DocumentAction } from 'app/schema/api-document';
import { Platform } from '@ionic/angular';

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

  @Input() actions: boolean = false;
  @Input() open: boolean = false;

  @Output()
  change = new EventEmitter<Event>();

  constructor(
    private api: ApiService,
    public platform: Platform
  ) { }

  ngOnInit() {
  }

  async loadEvent(eventId: string) {
    this.event = await this.api.get<Event>(["event", eventId]);
  }

  async reload() {
    if (this.event && this.event._id) return this.loadEvent(this.event._id);
  }

  async eventAction(action: DocumentAction, takeNote: boolean = false) {

    let note: string = "";

    if (takeNote) {
      const promptResult = window.prompt("Poznámka k vrácení akce:");

      // hit cancel in the prompt cancels the action
      if (promptResult === null) return;

      note = promptResult;

    }

    await this.api.post(action, { note: note || undefined });

    await this.reload();
    this.change.emit(this.event);

  }

}
