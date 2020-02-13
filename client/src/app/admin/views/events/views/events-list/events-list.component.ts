import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Event } from "app/shared/schema/event";
import { DateTime } from 'luxon';
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'bo-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {

  statuses: any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  };

  events: Event[] = [];

  years: number[] = [];
  year: number;

  @ViewChild('createEventModal', { static: true }) createEventModal: TemplateRef<any>;

  createEventModalRef: BsModalRef;

  paramsSubscription: Subscription;

  canCreate: boolean;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private titleService: TitleService,
    public menuService: MenuService
  ) {
    
    api.resources
      .then(resources => resources.events.allowed.POST)
      .then(canCreate => this.canCreate = canCreate);
  }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.year = Number(params.year);
      this.loadEvents();
    });

    this.loadYears();

    //

    this.titleService.setPageTitle("Přehled akcí");

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.titleService.reset();
    this.menuService.reset();
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("events:years");
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
    this.router.navigate([event._id], { relativeTo: this.route });
  }

  openCreateEventModal() {
    this.createEventModalRef = this.modalService.show(this.createEventModal);
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
