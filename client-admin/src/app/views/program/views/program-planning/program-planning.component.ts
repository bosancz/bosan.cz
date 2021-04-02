import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DateTime } from "luxon";

import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/shared/schema/event";
import { ConfigService } from 'app/services/config.service';
import { WebConfigEventStatus } from 'app/shared/schema/web-config';

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

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private configService: ConfigService, private toastService: ToastService) {

  }

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

  async createEvent([dateFrom, dateTill]: [DateTime, DateTime]) {

    var name = window.prompt("Bude vytvořena akce v termínu " + dateFrom.toLocaleString() + " - " + dateTill.toLocaleString() + ". Zadejte její název:");

    if (!name) return;

    const eventData = {
      name,
      dateFrom: dateFrom.toISODate(),
      dateTill: dateTill.toISODate()
    };

    await this.api.post("events", eventData);

    await this.loadEvents();

    this.toastService.toast("Akce vytvořena.");

  }
}