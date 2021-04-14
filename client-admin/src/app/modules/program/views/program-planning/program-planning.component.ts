import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DateTime } from "luxon";

import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/schema/event";
import { ConfigService } from 'app/core/services/config.service';
import { WebConfigEventStatus } from 'app/schema/web-config';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'program-planning',
  templateUrl: './program-planning.component.html',
  styleUrls: ['./program-planning.component.scss']
})
export class ProgramPlanningComponent implements OnInit, OnDestroy {

  dateFrom?: DateTime;
  dateTill?: DateTime;

  events: Event[] = [];

  statuses?: WebConfigEventStatus[];

  paramsSubscription?: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private toastService: ToastService,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.loadStatuses();

    this.paramsSubscription = this.route.queryParams.subscribe((params: Params) => {

      if (params.dateFrom && params.dateTill) {

        this.dateFrom = DateTime.fromISO(params.dateFrom);
        this.dateTill = DateTime.fromISO(params.dateTill);

        this.loadEvents();
      }

    });
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  async loadStatuses() {
    const config = await this.configService.getConfig();
    this.statuses = config.events.statuses;
  }

  async loadEvents() {

    if (!this.dateTill || !this.dateFrom) return;

    const requestOptions = {
      filter: {
        dateFrom: { $lte: this.dateTill.toISODate() },
        dateTill: { $gte: this.dateFrom.toISODate() },
      },
      select: "_id name status type dateFrom dateTill timeFrom timeTill"
    };

    this.events = await this.api.get<Event[]>("events", requestOptions);

  }

  setPeriod(period: [string, string]) {
    const params = {
      dateFrom: period[0],
      dateTill: period[1]
    };
    this.router.navigate(["./"], { queryParams: params, relativeTo: this.route, replaceUrl: true });
  }

  async openCreateEventModal([dateFrom, dateTill]: [DateTime, DateTime]) {

    const alert = await this.alertController.create({
      header: "Vytvořit akci",
      inputs: [
        {
          name: "name",
          placeholder: "Neočekávaný dýchánek",
          attributes: { required: true }
        },
        {
          name: "dateFrom",
          type: "date",
          value: dateFrom.toISODate(),
          attributes: { required: true }
        },
        {
          name: "dateTill",
          type: "date",
          value: dateTill.toISODate(),
          attributes: { required: true }
        },
        {
          name: "description",
          type: "textarea",
          placeholder: "Všichni budou tak opilí, že nám Šmajdalf ukáže trik se špičatým...",
          attributes: { required: true }
        },
      ],
      buttons: [
        { text: "Zrušit", role: "cancel" },
        {
          text: "Vytvořit",
          handler: (data) => {
            this.createEvent(data);
          }
        }
      ]
    });

    alert.present();
  }

  async createEvent(eventData: Partial<Event>) {

    if (!eventData.name || !eventData.dateFrom || !eventData.dateTill) {
      this.toastService.toast("Název i datum musí být vyplněno.");
      return;
    }

    await this.api.post("events", eventData);

    await this.loadEvents();

    this.toastService.toast("Akce vytvořena.");

  }
}