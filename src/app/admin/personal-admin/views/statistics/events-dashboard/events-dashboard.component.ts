import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Member } from 'app/schema/member';

interface EventsStats {
  attendees:{ count:number, groups: { [group:string]:number }, age: { [age:string]:number } };
  
  leaders:{ count:number,
    groups: { [group:string]:number },
    age: { [age:string]:number },
    top: [{ member: { nickname:string }, events:Event[] }]
  };
  
  events:{
    count:number,
    groups: { [group:string]:number },
    top: [{ name:string, dateFrom:string, dateTill:string, count:number }]
  };
}

interface ChartData {
  data:number[];
  label?:string;
}

@Component({
  selector: 'events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {

  report:EventsStats;

  minYear:number;
  maxYear:number;

  year:BehaviorSubject<number> = new BehaviorSubject(DateTime.local().year);

  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadEventYears();
    this.year.pipe(debounceTime(500)).subscribe(year => this.loadData(year));
  }

  async loadEventYears(){
    const years = await this.api.get<number[]>("events:years");
    this.minYear = Math.min(...years);
    this.maxYear = Math.max(...years);
  }

  async loadData(year:number){
    this.report = await this.api.get<EventsStats>(["reports:events",year]);
  }

  getChartData(data:{[key:string]:number}):ChartData[]{    
    if(!data) return [];
    return [{ data: Object.values(data) }];
  }

  getChartLabels(data:{[key:string]:number}):string[]{    
    if(!data) return [];
    return Object.keys(data);
  }

  joinMembers(members:Member[]):string {
    if(!members || !members.length) return "";
    return members.slice(0,members.length - 1).map(member => member.nickname).join(", ") + (members.length > 1 ? " a " : "") + members[members.length - 1].nickname;
  }
}
