import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventStatuses } from "app/config/event-statuses";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";
import { Album, Photo } from 'app/schema/album';
import { Event, EventActions } from "app/schema/event";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { filter } from 'rxjs/operators';
import { EventsService } from '../../../services/events.service';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-info',
  templateUrl: './events-view-info.component.html',
  styleUrls: ['./events-view-info.component.scss'],
})
export class EventsViewInfoComponent implements OnInit, OnDestroy {

  event?: Event;

  eventAlbum?: Album<Photo>;

  actions: Action[] = [];

  view: "event" | "attendees" | "accounting" | "registration" | "report" = "event";

  statuses = EventStatuses;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventsService.event$
      .pipe(untilDestroyed(this))
      .pipe(filter(event => !!event))
      .subscribe(event => this.updateEvent(event!));
  }

  ngOnDestroy() {
  }

  async updateEvent(event: Event) {
    this.event = event;

    this.actions = this.getActions(this.event);
  }

  async deleteEvent(event: Event) {
    if (window.confirm("Opravdu chcete smazat tuto akci?")) {


    }
  }

  async deleteEventConfirmed(event: Event) {
    await this.eventsService.deleteEvent(event._id);

    this.router.navigate(["../"], { relativeTo: this.route, replaceUrl: true });
    this.toastService.toast("Akce smazána");
  }

  async eventAction(event: Event, action: EventActions) {

    if (!event._actions?.[action].allowed) {
      this.toastService.toast("K této akci nemáš oprávnění.");
      return;
    }

    const note = window.prompt("Poznámka ke změně stavu (můžeš nechat prázdné):");
    if (note === null) return;

    await this.api.post(event._actions[action], { note: note || undefined });

    await this.eventsService.loadEvent(event._id);

    this.toastService.toast("Uloženo");
  }

  private getActions(event: Event): Action[] {
    return [
      {
        text: "Vést akci",
        color: "success",
        icon: "hand-left-outline",
        hidden: !event._actions?.lead,
        handler: () => this.eventAction(event, 'lead')
      },
      {
        text: "Upravit",
        pinned: true,
        icon: "create-outline",
        hidden: !event._links?.self.allowed.PATCH,
        handler: () => this.router.navigate(["../upravit"], { relativeTo: this.route })
      },
      {
        text: "Ke schválení",
        icon: "arrow-forward-outline",
        color: "primary",
        hidden: !event?._actions?.submit?.allowed,
        handler: () => this.eventAction(event, "submit")
      },
      {
        text: "Do programu",
        icon: "arrow-forward-outline",
        color: "primary",
        hidden: !event?._actions?.publish?.allowed,
        handler: () => this.eventAction(event, "publish")
      },
      {
        text: "Vrátit k úpravám",
        icon: "arrow-back-outline",
        color: "danger",
        hidden: !event?._actions?.reject?.allowed,
        handler: () => this.eventAction(event, "reject")
      },
      {
        text: "Odebrat z programu",
        icon: "arrow-back-outline",
        color: "danger",
        hidden: !event?._actions?.unpublish?.allowed,
        handler: () => this.eventAction(event, "unpublish")
      },
      {
        text: "Označit jako zrušenou",
        color: "danger",
        icon: "arrow-back-outline",
        hidden: !event?._actions?.cancel?.allowed,
        handler: () => this.eventAction(event, "cancel")
      },
      {
        text: "Odzrušit",
        icon: "arrow-forward-outline",
        hidden: !event?._actions?.uncancel?.allowed,
        handler: () => this.eventAction(event, "uncancel")
      },
      {
        text: "Smazat",
        role: "destructive",
        color: "danger",
        icon: "trash-outline",
        hidden: !event._links?.self?.allowed?.DELETE,
        handler: () => this.deleteEvent(event)
      },
    ];
  }

}
