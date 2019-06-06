import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';

import { Event } from "app/shared/schema/event";
import { ToastService } from 'app/core/services/toast.service';
import { ApiService } from 'app/core/services/api.service';

@Component({
  selector: 'event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.scss']
})
export class EventRegistrationComponent {

  @Input() event: Event;
  @Input() readonly: boolean;

  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  uploadingRegistration: boolean = false;

  modalRef:BsModalRef;

  constructor(private api: ApiService, private toastService: ToastService, private modalService:BsModalService) { }

  async uploadRegistration(input: HTMLInputElement) {

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
      await this.api.put(this.event._links.registration, formData);
    }
    catch (err) {
      this.toastService.toast("Nastala chyba při nahrávání: " + err.message);
    }

    this.uploadingRegistration = false;

    this.change.emit()

    this.toastService.toast("Přihláška nahrána.");
  }

  async deleteRegistration() {
    await this.api.delete(this.event._links.registration);
    this.change.emit()
    this.toastService.toast("Přihláška smazána.");
  }

  getRegistrationUrl(): string {
    return this.api.link2href(this.event._links.registration);
  }

  openRegistration(registrationTemplate: TemplateRef<any>) {
    const modalOptions: ModalOptions = { animated: false, class: 'modal-lg' };
    this.modalRef = this.modalService.show(registrationTemplate, modalOptions);
  }

}
