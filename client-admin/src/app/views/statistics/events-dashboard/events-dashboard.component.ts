import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, first } from 'rxjs/operators';
import { Member } from 'app/shared/schema/member';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateTime } from 'luxon';

interface EventsReport {
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

class ChartData {
  data: { data: number[]; label?: string; }[] = [];

  labels: string[] = [];
}

@Component({
  selector: 'events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  report: EventsReport;

  minYear: number;
  maxYear: number;
  years: number[] = [];

  year: Observable<number>;

  chartData = {
    leaders: new ChartData(),
    attendees: new ChartData()
  }

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.loadEventYears();

    this.year = this.route.params.pipe(map((params: Params) => Number(params.year) || null));

    this.year.pipe(filter(year => !!year), debounceTime(500)).subscribe(year => this.loadData(year));

    this.year.pipe(first(), filter(year => !year)).subscribe(() => this.setYear(DateTime.local().year));
  }

  async loadEventYears() {
    this.years = await this.api.get<number[]>("events:years");
    this.years.sort();
  }

  async loadData(year: number) {
    this.report = await this.api.get<EventsReport>(["reports:events", year]);
    this.updateChartData(this.report);
  }

  setYear(year: number) {
    this.router.navigate(["./", { year: year }], { relativeTo: this.route })
  }

  updateChartData(report: EventsReport): void {
    if (!report) return;
    this.chartData.leaders = {
      data: [{ data: Object.values(report.leaders.age) }],
      labels: Object.keys(report.leaders.age)
    };
    this.chartData.attendees = {
      data: [{ data: Object.values(report.attendees.age) }],
      labels: Object.keys(report.attendees.age)
    };
  }

  joinMembers(members: Member[]): string {
    if (!members || !members.length) return "";
    return members.slice(0, members.length - 1).map(member => member.nickname).join(", ") + (members.length > 1 ? " a " : "") + members[members.length - 1].nickname;
  }
}
