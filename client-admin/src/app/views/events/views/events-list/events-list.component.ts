import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ApiService } from "app/services/api.service";

import { Event } from "app/shared/schema/event";
import { DateTime } from 'luxon';
import { WebConfigEventStatus } from 'app/shared/schema/web-config';
import { ConfigService } from 'app/services/config.service';
import { Subject, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

type EventWithSearchString = Event & { searchString?: string };

@Component({
  selector: 'bo-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  events$ = new Subject<EventWithSearchString[]>();
  filteredEvents$: Observable<EventWithSearchString[]>;

  years: number[] = [];
  currentYear: number;

  statuses: WebConfigEventStatus[];

  canCreate: boolean;

  @ViewChild('filterForm', { static: true }) filterForm: NgForm;

  showFilter: boolean = false;

  search$ = new BehaviorSubject<string>("");

  constructor(
    private api: ApiService,
    private configService: ConfigService
  ) {

    api.resources
      .then(resources => resources.events.allowed.POST)
      .then(canCreate => this.canCreate = canCreate);

    this.filteredEvents$ = combineLatest(this.events$, this.search$.pipe(debounceTime(250)))
      .pipe(map(([events, search]) => this.filterEvents(events, search)));

  }

  ngOnInit() {

    this.loadYears();
    this.loadConfig();

  }

  ngAfterViewInit() {
    this.filterForm.valueChanges.subscribe(filter => {
      this.loadEvents(filter);
    });
  }

  async loadConfig() {
    const config = await this.configService.getConfig();
    this.statuses = config.events.statuses;
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("events:years");
    this.years.sort((a, b) => b - a);
    
    const thisYear = DateTime.local().year;
    if(this.years.indexOf(thisYear) !== -1) this.currentYear = thisYear;
    else this.currentYear = this.years[0];
  }

  async loadEvents(filter: any) {

    if (!filter.year) return;

    const options: any = {
      sort: "dateFrom",
    };

    options.filter = {
      dateTill: { $gte: DateTime.local().set({ year: filter.year, month: 1, day: 1 }).toISODate() },
      dateFrom: { $lte: DateTime.local().set({ year: filter.year, month: 12, day: 31 }).toISODate() }
    }

    if (filter.status) options.filter.status = filter.status;

    const events: EventWithSearchString[] = await this.api.get<Event[]>("events", options);

    events.forEach(event => {
      event.searchString = [
        event.name,
        event.place,
        event.leaders.map(member => member.nickname).join(" ")
      ].filter(item => !!item).join(" ")
    })

    this.events$.next(events);

  }

  filterEvents(events: EventWithSearchString[], search: string) {
    
    if(!search) return events;
    
    const search_re = new RegExp("(^| )" + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i")
    
    return events.filter(event => search_re.test(event.searchString))
  }

  getLeadersString(event: Event) {
    return event.leaders.map(item => item.nickname).join(", ");
  }

}
