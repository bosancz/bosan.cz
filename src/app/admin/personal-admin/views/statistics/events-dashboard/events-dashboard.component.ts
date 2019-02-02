import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, first } from 'rxjs/operators';
import { Member } from 'app/shared/schema/member';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateTime } from 'luxon';

interface EventsStats {
  attendees: { count: number, groups: { [group: string]: number }, age: { [age: string]: number } };

  leaders: {
    count: number,
    groups: { [group: string]: number },
    age: { [age: string]: number },
    top: [{ member: { nickname: string }, events: Event[] }]
  };

  events: {
    count: number,
    groups: { [group: string]: number },
    top: [{ name: string, dateFrom: string, dateTill: string, count: number }],
    days: number,
    mandays: number
  };
}

interface ChartData {
  data: number[];
  label?: string;
}

@Component({
  selector: 'events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  report: EventsStats;

  minYear: number;
  maxYear: number;
  years: number[] = [];

  year: Observable<number>;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.loadEventYears();

    this.year = this.route.params.pipe(map((params: Params) => Number(params.year) || null));

    this.year.pipe(filter(year => !!year),debounceTime(500)).subscribe(year => this.loadData(year));

    this.year.pipe(first(), filter(year => !year)).subscribe(year => this.setYear(DateTime.local().year));
  }

  async loadEventYears() {
    this.years = await this.api.get<number[]>("events:years");
    this.years.sort();
  }

  async loadData(year: number) {    
    this.report = await this.api.get<EventsStats>(["reports:events", year]);
  }

  setYear(year: number) {
    this.router.navigate(["./", { year: year }], { relativeTo: this.route })
  }

  getChartData(data: { [key: string]: number }): ChartData[] {
    if (!data) return [];
    return [{ data: Object.values(data) }];
  }

  getChartLabels(data: { [key: string]: number }): string[] {
    if (!data) return [];
    return Object.keys(data);
  }

  joinMembers(members: Member[]): string {
    if (!members || !members.length) return "";
    return members.slice(0, members.length - 1).map(member => member.nickname).join(", ") + (members.length > 1 ? " a " : "") + members[members.length - 1].nickname;
  }
}
