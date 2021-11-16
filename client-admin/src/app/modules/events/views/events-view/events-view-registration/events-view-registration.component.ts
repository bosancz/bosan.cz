import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Event } from "app/schema/event";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { filter } from 'rxjs/operators';
import { EventsService } from '../../../services/events.service';


@UntilDestroy()
@Component({
  selector: 'events-view-registration',
  templateUrl: './events-view-registration.component.html',
  styleUrls: ['./events-view-registration.component.scss']
})
export class EventsViewRegistrationComponent {

  event?: Event;

  uploadingRegistration: boolean = false;

  actions: Action[] = [];

  @ViewChild("registrationInput") registrationInput!: ElementRef<HTMLInputElement>;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private eventService: EventsService,
    private sanitizer: DomSanitizer
  ) {
    this.eventService.event$
      .pipe(filter(event => !!event))
      .subscribe(event => this.updateEvent(event!));
  }

  private updateEvent(event: Event) {
    this.event = event;
    this.setActions(event);
  }

  uploadRegistrationSelect() {
    this.registrationInput.nativeElement.click();
  }

  async uploadRegistration(input: HTMLInputElement) {

    if (!this.event) return;

    if (!this.event._links?.registration) return;
    if (!input.files?.length) return;

    let file = input.files![0];

    if (file.name.split(".").pop()?.toLowerCase() !== "pdf") {
      this.toastService.toast("Soubor musí být ve formátu PDF");
      return;
    }

    let formData: FormData = new FormData();

    formData.set("file", file, file.name);

    this.uploadingRegistration = true;

    try {
      await this.api.put(this.event._links.registration, formData);
    }
    catch (err: any) {
      this.toastService.toast("Nastala chyba při nahrávání: " + err.message);
    }

    this.uploadingRegistration = false;
    this.toastService.toast("Přihláška nahrána.");

    this.eventService.loadEvent(this.event._id);

  }

  async deleteRegistration() {
    if (!this.event) return;
    if (!this.event._links?.registration) return;

    await this.api.delete(this.event._links.registration);
    this.toastService.toast("Přihláška smazána.");

    this.eventService.loadEvent(this.event._id);
  }

  private downloadRegistration() {
    if (!this.event) return;
    window.open(this.getRegistrationUrl(this.event));
  }

  getRegistrationUrl(event: Event) {
    return this.api.link2href(event._links?.registration!);
  }

  getSafeRegistrationUrl(event: Event) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getRegistrationUrl(event));
  }

  setActions(event: Event) {
    this.actions = [
      {
        text: "Stáhnout",
        hidden: !event._links?.registration?.allowed.GET,
        handler: () => this.downloadRegistration()
      },
      {
        text: "Nahrát",
        hidden: !event._links?.registration?.allowed.PUT,
        handler: () => this.uploadRegistrationSelect()
      },
      {
        text: "Smazat",
        role: "destructive",
        color: "danger",
        hidden: !event?.registration || !event._links?.registration?.allowed.DELETE,
        handler: () => this.deleteRegistration()
      }
    ];
  }

}
