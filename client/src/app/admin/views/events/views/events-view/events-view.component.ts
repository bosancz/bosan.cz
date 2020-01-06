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
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';

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

  editing: boolean = false;

  days: number;

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private location: Location,
    private configService: ConfigService,
    private titleService: TitleService,
    private menuService: MenuService
  ) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      if (!this.event || params.event !== this.event._id) this.loadEvent(params.event);
    });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.titleService.reset();
    this.menuService.reset();
  }

  async loadEvent(eventId: string) {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    this.days = DateTime.fromISO(event.dateTill).diff(DateTime.fromISO(event.dateFrom), "days").days + 1;

    this.event = event;

    this.titleService.setPageTitle(event.name);

    this.editable = this.event._links.self.allowed.PATCH;

    this.setMenu();
  }

  setMenu() {
    const actions = [];

    if (!this.editing) actions.push({ type: "action", "label": "Upravit", disabled: this.editable, callback: () => { this.editing = true; this.setMenu() } })

    if (this.editing) actions.push(...[
      { type: "action", "label": "Zrušit úpravy", disabled: this.editable, callback: () => this.cancelEdit() },
      { type: "action", "label": "Uložit", disabled: this.editable, callback: () => this.saveEvent() }
    ])

    const event = this.event;

    if (!this.editing && event && event._actions) {
      actions.push({ type: "divider" });

      if (event._actions.submit) actions.push({ type: "action", disabled: !event._actions.submit.allowed, callback: () => this.eventAction('submit'), label: "Ke schválení" });
      if (event._actions.publish) actions.push({ type: "action", disabled: !event._actions.publish.allowed, callback: () => this.eventAction('publish'), label: "Do programu" });
      if (event._actions.announce) actions.push({ type: "action", disabled: !event._actions.announce.allowed, callback: () => this.eventAction('submit'), label: "Poslat ohlášku" });
      if (event._actions.finalize) actions.push({ type: "action", disabled: !event._actions.finalize.allowed, callback: () => this.eventAction('submit'), label: "Uzavřít" });
      if (event._actions.reject) actions.push({ type: "action", disabled: !event._actions.reject.allowed, callback: () => this.eventAction('reject'), label: "Vrátit vedoucím k úpravám" });
      if (event._actions.unpublish) actions.push({ type: "action", disabled: !event._actions.unpublish.allowed, callback: () => this.eventAction('unpublish'), label: "Odebrat z programu" });
      if (event._actions.cancel) actions.push({ type: "action", disabled: !event._actions.cancel.allowed, callback: () => this.eventAction('cancel'), label: "Zrušit", class: "text-danger" });
      if (event._actions.uncancel) actions.push({ type: "action", disabled: !event._actions.uncancel.allowed, callback: () => this.eventAction('uncancel'), label: "Odzrušit" });
    }
    /*
        <a [class.disabled]="!event._links?.self?.allowed.DELETE" class="dropdown-item text-danger" (click)="deleteEvent()">Smazat</a>

        <div class="dropdown-divider"></div>

        <a class="dropdown-item" [href]="getAnnouncementTemplateUrl()">Stáhnout ohlášku</a>
        <a class="dropdown-item" [href]="getAccountingTemplateUrl()">Stáhnout účtování</a>
        */

    this.menuService.setActions(actions);
  }

  async cancelEdit() {
    this.editing = false;
    this.setMenu();
    await this.loadEvent(this.event._id);
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

    this.setMenu();
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
