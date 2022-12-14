import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, ViewWillEnter } from "@ionic/angular";
import { EventsService } from "app/modules/events/services/events.service";
import { Event } from "app/schema/event";
import { Action } from "app/shared/components/action-buttons/action-buttons.component";
import { TrimesterDateRange } from "../../components/trimester-selector/trimester-selector.component";

@Component({
  selector: "bo-program-calendar",
  templateUrl: "./program-calendar.component.html",
  styleUrls: ["./program-calendar.component.scss"],
})
export class ProgramCalendarComponent implements OnInit, OnDestroy, ViewWillEnter {
  dateFrom?: string;
  dateTill?: string;

  calendarEvents: Event[] = [];

  showFilter: boolean = true;

  actions: Action[] = [];

  view: "list" | "calendar" = "calendar";

  modal?: HTMLIonModalElement;

  lg!: boolean;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const lgQuery = window.matchMedia("(min-width: 992px)");

    this.lg = lgQuery.matches;
    this.setActions();

    lgQuery.addEventListener("change", (event) => {
      this.lg = event.matches;
      this.setActions();
    });

    this.route.queryParams.subscribe((params) => {
      this.dateFrom = params["from"];
      this.dateTill = params["till"];
      if (this.dateFrom && this.dateTill) {
        this.loadCalendarEvents(this.dateFrom, this.dateTill);
      }
    });
  }

  ionViewWillEnter() {
    if (this.dateFrom && this.dateTill) {
      this.loadCalendarEvents(this.dateFrom, this.dateTill);
    }
  }

  ngOnDestroy() {
    this.modal?.dismiss();
  }

  setTrimester(dateRange: TrimesterDateRange) {
    const queryParams = {
      from: dateRange[0],
      till: dateRange[1],
    };
    this.router.navigate(["./"], { queryParams, replaceUrl: true, relativeTo: this.route });
  }

  async loadCalendarEvents(dateFrom: string, dateTill: string) {
    const options: any = {
      sort: "dateFrom",
      filter: {
        dateTill: { $gte: dateFrom },
        dateFrom: { $lte: dateTill },
      },
    };

    this.calendarEvents = await this.eventsService.listEvents(options);
  }

  // setView(view: "list" | "calendar") {
  //   this.view = view;
  //   this.setActions();
  // }

  setActions() {
    this.actions = [
      // {
      //   text: "Kalendář",
      //   icon: "calendar-outline",
      //   pinned: true,
      //   hidden: this.lg || this.view === "calendar",
      //   handler: () => this.setView("calendar"),
      // },
      // {
      //   text: "Seznam",
      //   icon: "list-outline",
      //   pinned: true,
      //   hidden: this.lg || this.view === "list",
      //   handler: () => this.setView("list"),
      // }
    ];
  }
}
