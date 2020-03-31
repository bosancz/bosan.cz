import { Component } from '@angular/core';

import { ToastService } from 'app/services/toast.service';
import { ApiService } from 'app/services/api.service';
import { EventsService } from '../../../services/events.service';

import { Event } from "app/shared/schema/event";

@Component({
  selector: 'event-edit-registration',
  templateUrl: './event-edit-registration.component.html',
  styleUrls: ['./event-edit-registration.component.scss']
})
export class EventEditRegistrationComponent {

  event$ = this.eventService.event$;

  uploadingRegistration: boolean = false;

  constructor(private api: ApiService, private toastService: ToastService, private eventService: EventsService) { }

  async uploadRegistration(event: Event, input: HTMLInputElement) {

    if (!input.files.length) return;

    let file = input.files[0];

    if (file.name.split(".").pop().toLowerCase() !== "pdf") {
      this.toastService.toast("Soubor musí být ve formátu PDF");
      return;
    }

    let formData: FormData = new FormData();

    formData.set("file", file, file.name);

    this.uploadingRegistration = true;

    try {
      await this.api.put(event._links.registration, formData);
    }
    catch (err) {
      this.toastService.toast("Nastala chyba při nahrávání: " + err.message);
    }

    this.uploadingRegistration = false;
    this.toastService.toast("Přihláška nahrána.");

    this.eventService.loadEvent(event._id);

  }

  async deleteRegistration(event: Event) {
    await this.api.delete(event._links.registration);
    this.toastService.toast("Přihláška smazána.");
  }

  getRegistrationUrl(event): string {
    return this.api.link2href(event._links.registration);
  }

}
