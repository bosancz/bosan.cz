import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';

interface EventsStats {
  leaders:{ count:number, groups: { [group:string]:number }, age: { [age:string]:number } };
  attendees:{ count:number, groups: { [group:string]:number }, age: { [age:string]:number } };
  events:{ count:number, groups: { [group:string]:number } };
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

  events:EventsStats;

  year:BehaviorSubject<number> = new BehaviorSubject(DateTime.local().year);

  constructor(private api:ApiService) { }

  ngOnInit() {
    this.year.subscribe(year => this.loadData(year));
  }

  async loadData(year:number){
    this.events = await this.api.get<EventsStats>("reports:leaders", { year: year });
  }

  getChartData(data:{[key:string]:number}):ChartData[]{    
    if(!data) return [];
    return [{ data: Object.values(data) }];
  }

  getChartLabels(data:{[key:string]:number}):string[]{    
    if(!data) return [];
    return Object.keys(data);
  }

}
