import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DateTime } from "luxon";
import { CzechHolidays, HolidayDate } from "czech-holidays";

import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Event } from "app/shared/schema/event";
import { CPVEvent } from "app/shared/schema/cpv-event";
import { ConfigService } from 'app/core/services/config.service';
import { WebConfigEventStatus } from 'app/shared/schema/webconfig';

@Component({
  selector: 'program-planning',
  templateUrl: './program-planning.component.html',
  styleUrls: ['./program-planning.component.scss']
})
export class ProgramPlanningComponent implements OnInit, OnDestroy {

  trimester: number;
  year: number;

  dateFrom: DateTime;
  dateTill: DateTime;

  trimesterMonths = [[1, 4], [5, 8], [9, 12]]; // trimster months (jan-may, ...)

  events: Event[] = [];

  statuses: WebConfigEventStatus[];

  paramsSubscription: Subscription;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private configService: ConfigService, private toastService: ToastService) {

  }

  ngOnInit() {

    this.loadStatuses();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {

      if (params.rok === undefined) return this.router.navigate(["./", this.getUpcomingTrimester()], { relativeTo: this.route, replaceUrl: true });
      if (params.trimestr === undefined) this.router.navigate(["./", { rok: params.rok, trimestr: 0 }], { relativeTo: this.route, replaceUrl: true });

      this.year = Number(params.rok);
      this.trimester = Number(params.trimestr);

      this.dateFrom = DateTime.fromObject({ year: this.year, month: this.trimesterMonths[Number(this.trimester)][0], day: 1 });
      this.dateTill = DateTime.fromObject({ year: this.year, month: this.trimesterMonths[Number(this.trimester)][1], day: 1 }).endOf("month");

      this.loadEvents();

    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadStatuses() {
    const config = await this.configService.getConfig();
    this.statuses = config.events.statuses;
  }

  setTrimester(trimesterForm: NgForm) {

    const formData = trimesterForm.value;

    this.router.navigate(["./", { rok: formData.year, trimestr: formData.trimester }], { relativeTo: this.route, replaceUrl: true });

  }

  getPreviousTrimester() {
    if (this.trimester === 0) return { rok: this.year - 1, trimestr: this.trimesterMonths.length - 1 };
    else return { rok: this.year, trimestr: this.trimester - 1 };
  }
  getNextTrimester() {
    if (this.trimester === this.trimesterMonths.length - 1) return { rok: this.year + 1, trimestr: 0 };
    else return { rok: this.year, trimestr: this.trimester + 1 };
  }

  getUpcomingTrimester() {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let i = 0;
    while (new Date(currentYear, this.trimesterMonths[i][0], 1) < currentDate) {
      if (i < this.trimesterMonths.length - 1) i++;
      else { i = 0; currentYear++; }
    }
    return { rok: currentYear, trimestr: i };
  }



  async loadEvents() {

    var c = 0;

    const requestOptions = {
      filter: {
        dateTill: { $gte: this.dateFrom.toISODate() },
        dateFrom: { $lte: this.dateTill.toISODate() }
      },
      select: "_id name status type dateFrom dateTill timeFrom timeTill"
    };

    this.events = await this.api.get<Event[]>("events", requestOptions);

  }



  async createEvent([dateFrom, dateTill]: [DateTime, DateTime]) {

    var name = window.prompt("Bude vytvořena akce v termínu " + dateFrom.toLocaleString() + " - " + dateTill.toLocaleString() + ". Zadejte její název:");

    if (!name) return;

    const eventData = {
      name,
      dateFrom: dateFrom.toISODate(),
      dateTill: dateTill.toISODate()
    };

    await this.api.post("events", eventData)

    await this.loadEvents();

    this.toastService.toast("Akce vytvořena.")

  }
} 