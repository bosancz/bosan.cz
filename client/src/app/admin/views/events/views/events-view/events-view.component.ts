import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription, from, ReplaySubject } from "rxjs";
import { DateTime } from "luxon";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";
import { ConfigService } from "app/core/services/config.service";

import { Event, EventExpense } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";
import { TitleService } from 'app/core/services/title.service';
import { MenuService, ActionItem } from 'app/core/services/menu.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'bo-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss'],
})
export class EventsViewComponent implements OnInit {

  event$ = new ReplaySubject<Event>(1);


  days: number;

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

    this.route.params
      .pipe(map((params: Params) => params.event))
      .pipe(mergeMap(eventId => from(this.loadEvent(eventId))))
      .subscribe(this.event$);

  }

  async loadEvent(eventId: string) {
    const event = await this.api.get<Event>(["event", eventId], { populate: ["leaders"] });

    event.attendees.sort((a, b) => a.nickname.localeCompare(b.nickname));

    if (!event.meeting) event.meeting = { start: undefined, end: undefined };
    if (!event.competition) event.competition = { river: undefined, water_km: undefined }
    if (!event.expenses) event.expenses = [];

    event.dateFrom = DateTime.fromISO(event.dateFrom).toISODate();
    event.dateTill = DateTime.fromISO(event.dateTill).toISODate();

    return event;

  }

  async deleteEvent(event: Event) {
    if (window.confirm("Opravdu chcete smazat tuto akci?")) {
      await this.api.delete(event._links.self);
      this.router.navigate(["../"], { relativeTo: this.route });
      this.toastService.toast("Akce smazána");
    }
  }

  async eventAction(event: Event, action: string) {

    if (!event._actions[action].allowed) {
      this.toastService.toast("K této akci nemáš oprávnění.")
      return;
    }

    const note = window.prompt("Poznámka ke změně stavu (můžeš nechat prázdné):");
    if (note === null) return;

    await this.api.post(event._actions[action], { note: note || undefined });

    this.event$.next(await this.loadEvent(event._id));

    this.toastService.toast("Uloženo");
  }

}
