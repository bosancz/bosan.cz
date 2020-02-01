import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DateTime } from "luxon";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Event } from "app/shared/schema/event";

@Component({
  selector: 'program-events-list',
  templateUrl: './program-events-list.component.html',
  styleUrls: ['./program-events-list.component.scss']
})
export class ProgramEventsListComponent implements OnInit {

  @Input() status: string;
  @Output() change: EventEmitter<void> = new EventEmitter();

  events: Event[] = [];

  constructor(
    private api: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    const options = {
      limit: 100,
      filter: {
        dateFrom: { $gte: DateTime.local().toISODate() },
        status: this.status || undefined
      },
      sort: "dateFrom",
      select: "_id status name description dateFrom dateTill leaders subtype"
    };

    this.events = await this.api.get<Event[]>("events", options);
  }

  reload() {
    return this.loadEvents();  
  }

  async submitEvent(event: Event): Promise<void> {
    await this.api.post(event._actions.submit);
    this.toastService.toast("Odesláno ke schválení.");
    this.reload();
    this.change.emit();
  }
  async rejectEvent(event: Event): Promise<void> {
    const note = window.prompt("Poznámka k vrácení akce:")

    // hit cancel in the prompt cancels the action
    if (note === null) return;

    await this.api.post(event._actions.reject, { note: note || undefined });

    this.toastService.toast("Vráceno k úpravám.");
    this.reload();
    this.change.emit();
  }

  async publishEvent(event: Event): Promise<void> {
    await this.api.post(event._actions.publish);
    this.toastService.toast("Publikováno.");
    this.reload();
    this.change.emit();
  }
  async unpublishEvent(event: Event): Promise<void> {
    await this.api.post(event._actions.unpublish);
    this.toastService.toast("Vráceno do připravovaných akcí.");
    this.reload();
    this.change.emit();
  }

  async cancelEvent(event: Event): Promise<void> {
    await this.api.post(event._actions.cancel);
    this.toastService.toast("Akce je nyní v programu jako zrušená.");
    this.reload();
    this.change.emit();
  }
  async uncancelEvent(event: Event): Promise<void> {
    await this.api.post(event._actions.uncancel);
    this.toastService.toast("Zrušení akce bylo zrušeno.");
    this.reload();
    this.change.emit();
  }

}
