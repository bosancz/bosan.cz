import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';

import { Event } from 'app/schema/event';
import { NgForm } from '@angular/forms';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@Component({
  selector: 'events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {

  actions: Action[] = [
    {
      text: "Vytvořit",
      handler: () => this.createEvent()
    }
  ];

  @ViewChild("createEventForm") form!: NgForm;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async createEvent() {

    if (!this.form.valid) {
      this.toastService.toast("Akci nelze vytvořit, ve formuláři jsou chyby.");
      return;
    }

    // get data from form
    let eventData = <Partial<Event>>this.form.value;

    // prevent switched date order
    if (eventData.dateFrom && eventData.dateTill) {
      const dates = [eventData.dateFrom, eventData.dateTill];
      dates.sort();
      eventData.dateFrom = dates[0];
      eventData.dateTill = dates[1];
    }

    // create the event and wait for confirmation
    let response = await this.api.post("events", eventData);

    const location = response.headers.get("location");
    if (!location) {
      this.toastService.toast("Chyba při otevírání nové akce.");
      return;
    }

    // get the event id
    let event = await this.api.get<Event>({ href: location }, { select: "_id" });
    // show the confrmation
    this.toastService.toast("Akce vytvořena a uložena.");
    // open the event
    this.router.navigate(["/akce/" + event._id + "/upravit"]);
  }

}
