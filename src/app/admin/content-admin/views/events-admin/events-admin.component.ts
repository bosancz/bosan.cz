import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/shared/schema/event";
import { DateTime } from 'luxon';

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit, OnDestroy {

  statuses: any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  };

  events: Event[] = [];

  years: number[] = [];
  year: number;

  createEventModalRef: BsModalRef;

  paramsSubscription: Subscription;

  constructor(private api: ApiService, private configService: ConfigService, private toastService: ToastService, private router: Router, private route: ActivatedRoute, private modalService: BsModalService) {
  }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.year = Number(params.year);
      this.loadEvents();
    });

    this.loadYears();

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("albums:years");
    this.years.sort((a, b) => b - a);
  }

  async loadEvents() {

    const options: any = {
      sort: "dateFrom",
    };

    if (this.year) {
      options.filter = {
        dateTill: { $gte: DateTime.local().set({ year: this.year, month: 1, day: 1 }).toISODate() },
        dateFrom: { $lte: DateTime.local().set({ year: this.year, month: 12, day: 31 }).toISODate() }
      }
    }
    else options.filter = { dateTill: !this.year ? { $gte: DateTime.local().toISODate() } : undefined };

    this.events = await this.api.get<Event[]>("events", options);

  }

  openEvent(event: Event): void {
    this.router.navigate(['../akce/' + event._id], { relativeTo: this.route });
  }

  openCreateEventModal(template: TemplateRef<any>) {
    this.createEventModalRef = this.modalService.show(template);
  }

  async createEvent(form: NgForm) {
    // get data from form
    let eventData = form.value;
    // create the event and wait for confirmation
    let response = await this.api.post("events", eventData);
    // get the event id
    let event = await this.api.get<Event>(response.headers.get("location"), { select: "_id" });
    // close the modal
    this.createEventModalRef.hide();
    // show the confrmation
    this.toastService.toast("Akce vytvořena a uložena.");
    // open the event
    this.router.navigate(["/interni/obsah/akce/" + event._id + "/upravit"]);
  }

  getLeadersString(event: Event) {
    return event.leaders.map(item => item.nickname).join(", ");
  }

}
