import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewWillEnter } from "@ionic/angular";
import { EventStatuses } from "app/config/event-statuses";
import { ApiService } from "app/core/services/api.service";
import { Event } from "app/schema/event";
import { Action } from "app/shared/components/action-buttons/action-buttons.component";
import { DateTime } from "luxon";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";

type EventWithSearchString = Event & { searchString: string };

@Component({
  selector: "bo-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
})
export class EventsListComponent implements ViewWillEnter {
  events$ = new Subject<EventWithSearchString[]>();
  filteredEvents$: Observable<EventWithSearchString[]>;

  years: number[] = [];
  currentYear?: number;

  statuses = EventStatuses;

  canCreate?: boolean;

  @ViewChild("filterForm", { static: true }) filterForm!: NgForm;

  showFilter: boolean = false;

  search$ = new BehaviorSubject<string>("");

  actions: Action[] = [];

  loadingArray = Array(5).fill(null);

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {
    api.resources.then((resources) => resources.events.allowed.POST).then((canCreate) => (this.canCreate = canCreate));

    // TODO: rewrite to easier non rxjs filtering
    this.filteredEvents$ = combineLatest([this.events$, this.search$.pipe(debounceTime(250))]).pipe(
      map(([events, search]) => this.filterEvents(events, search))
    );
  }

  ionViewWillEnter(): void {
    this.loadYears();

    this.setActions();

    if (this.filterForm) this.loadEvents(this.filterForm.value);
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges!.subscribe((filter) => {
      this.loadEvents(filter);
    });
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("events:years");
    this.years.sort((a, b) => b - a);

    const thisYear = DateTime.local().year;
    if (this.years.indexOf(thisYear) !== -1) this.currentYear = thisYear;
    else this.currentYear = this.years[0];
  }

  async loadEvents(filter: any) {
    if (!filter.year) return;

    const options: any = {
      sort: "dateFrom",
    };

    options.filter = {
      dateTill: { $gte: DateTime.local().set({ year: filter.year, month: 1, day: 1 }).toISODate() },
      dateFrom: { $lte: DateTime.local().set({ year: filter.year, month: 12, day: 31 }).toISODate() },
    };

    if (filter.status) options.filter.status = filter.status;

    const events = await this.api.get<Event[]>("events", options);

    const eventsWithSearchString = events.map((event) => {
      const searchString = [event.name, event.place, event.leaders?.map((member) => member.nickname).join(" ")]
        .filter((item) => !!item)
        .join(" ");
      return { ...event, searchString };
    });

    this.events$.next(eventsWithSearchString);
  }

  createEvent() {
    this.router.navigate(["vytvorit"], { relativeTo: this.route });
  }

  private filterEvents(events: EventWithSearchString[], search: string) {
    if (!search) return events;

    const search_re = new RegExp("(^| )" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    return events.filter((event) => search_re.test(event.searchString));
  }

  getLeadersString(event: Event) {
    return event.leaders?.map((item) => item.nickname).join(", ");
  }

  private async setActions() {
    const resources = await this.api.resources;

    this.actions = [
      {
        icon: "filter-outline",
        pinned: true,
        handler: () => (this.showFilter = !this.showFilter),
      },
      {
        icon: "add-outline",
        pinned: true,
        hidden: !resources["events"].allowed["POST"],
        handler: () => this.createEvent(),
      },
    ];
  }
}
