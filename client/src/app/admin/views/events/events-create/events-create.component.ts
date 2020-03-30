import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/admin/services/toast.service';

import { Event } from 'app/shared/schema/event';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {

  constructor(
    private api:ApiService,
    private toastService:ToastService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  async createEvent(form: NgForm) {
    // get data from form
    let eventData = form.value;
    // create the event and wait for confirmation
    let response = await this.api.post("events", eventData);
    // get the event id
    let event = await this.api.get<Event>(response.headers.get("location"), { select: "_id" });
    // show the confrmation
    this.toastService.toast("Akce vytvořena a uložena.");
    // open the event
    this.router.navigate(["/interni/obsah/akce/" + event._id + "/upravit"]);
  }

}
