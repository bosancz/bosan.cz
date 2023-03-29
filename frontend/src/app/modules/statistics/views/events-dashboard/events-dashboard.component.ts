import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';
import { Member } from 'app/schema/member';
import { DateTime } from 'luxon';
import { debounceTime } from 'rxjs/operators';

interface EventsReport {
  attendees: { count: number, groups: { [group: string]: number; }, age: { [age: string]: number; }; };

  leaders: {
    count: number,
    groups: { [group: string]: number; },
    age: { [age: string]: number; },
    top: [{ member: { nickname: string; }, events: Event[]; }];
  };

  events: {
    count: number,
    groups: { [group: string]: number; },
    top: [{ name: string, dateFrom: string, dateTill: string, count: number; leaders: Member[]; }],
    days: number,
    mandays: number;
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

  report?: EventsReport;

  minYear?: number;
  maxYear?: number;
  years: number[] = [];
  year?: number;

  chartData = {
    leaders: new ChartData(),
    attendees: new ChartData()
  };

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {

    this.route.params
      .pipe(debounceTime(500))
      .subscribe((params: Params) => {
        if (params.year) {
          this.year = Number(params.year) || undefined;
          this.loadData(params.year);
        }
        else {
          this.setYear(DateTime.local().year);
        }
      });

    this.loadEventYears();

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
    this.router.navigate(["./", { year: year }], { relativeTo: this.route });
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
