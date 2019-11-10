import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DateTime } from "luxon";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";
import { ConfigService } from "app/core/services/config.service";

import { Event, EventExpense } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";

@Component({
  selector: 'bo-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss'],
  host: {
    "class": "d-block container mt-3 mt-lg-5"
  }
})
export class EventsViewComponent implements OnInit, OnDestroy {

  event: Event;

  editable: boolean = false;

  

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private location: Location,
    private configService: ConfigService
  ) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
    });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadEvent(eventId: string) {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.event = event;

    this.editable = this.event._links.self.allowed.PATCH;
  }

  async saveEvent(data?: Partial<Event>) {
    const eventData = data || this.event;

    eventData.timeFrom = eventData.timeFrom || null;
    eventData.timeTill = eventData.timeTill || null;
    if (!eventData.groups || !eventData.groups.length) eventData.leadersEvent = true;

    await this.api.patch(this.event._links.self, eventData);
    await this.loadEvent(this.event._id);

    this.toastService.toast("Uloženo.");
    this.editing = null;
  }

  async deleteEvent() {
    if (window.confirm("Opravdu chcete smazat tuto akci?")) {
      await this.api.delete(this.event._links.self);
      this.router.navigate(["../"], { relativeTo: this.route });
      this.toastService.toast("Akce smazána");
    }
  }

  async eventAction(action: string) {

    if (!this.event._actions[action].allowed) {
      this.toastService.toast("K této akci nemáš oprávnění.")
      return;
    }

    const note = window.prompt("Poznámka ke změně stavu (můžeš nechat prázdné):");
    if (note === null) return;

    await this.api.post(this.event._actions[action], { note: note || undefined });

    await this.loadEvent(this.event._id);
    this.toastService.toast("Uloženo");
  }

  getAccountingTemplateUrl(): string {
    return this.api.link2href(this.event._links["accounting-template"]);
  }

  getAnnouncementTemplateUrl(): string {
    return this.api.link2href(this.event._links["announcement-template"]);
  }

}
