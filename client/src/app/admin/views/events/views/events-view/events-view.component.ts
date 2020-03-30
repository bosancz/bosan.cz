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
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'bo-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss'],
})
export class EventsViewComponent implements OnInit {

  event$ = this.eventsService.event$;

  days$ = this.event$.pipe(map(event => event ? DateTime.fromISO(event.dateTill).diff(DateTime.fromISO(event.dateFrom), "days").days + 1 : 0));

  paramsSubscription = this.route.params
    .pipe(map((params: Params) => params.event))
    .subscribe(eventId => this.eventsService.loadEvent(eventId));

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
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

    this.eventsService.loadEvent(event._id);

    this.toastService.toast("Uloženo");
  }

}
