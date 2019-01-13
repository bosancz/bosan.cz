import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DateTime } from "luxon";

import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";
import { CPVEvent } from "app/schema/cpv-event";
import { ConfigService } from 'app/services/config.service';
import { WebConfigEventStatus } from 'app/schema/webconfig';

class CalendarMonth {  
  
  days:CalendarDay[] = [];
  
  events:{
    own:CalendarEvent[],
    cpv:CalendarEvent[]
  } = { own: [], cpv: [] };

  constructor(public number:number,public year:number){ }
}

class CalendarDay {
  eventCount:number = 0;
  constructor(public date:DateTime){ }
}

class CalendarEvent {
  level?:number = 0;
  
  dateFrom:DateTime;
  dateTill:DateTime;
  
  constructor(public event:any){
    this.dateFrom = DateTime.fromISO(event.dateFrom).set({hour:0,minute:0});
    this.dateTill = DateTime.fromISO(event.dateTill).set({hour:0,minute:0});
  }
}

@Component({
  selector: 'event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.scss']
})
export class EventPlanningComponent implements OnInit, OnDestroy {

  trimester:number;
  year:number;

  dateFrom:DateTime;
  dateTill:DateTime;

  calendar:CalendarMonth[];

  holidays:any = ["1-1","5-1","5-8"];

  selection:[DateTime,DateTime];

  trimesterMonths = [ [1,4], [5,8], [9,12] ]; // trimster months (jan-may, ...)

  eventsCPV:CalendarEvent[];

  statuses:WebConfigEventStatus[];
  
  paramsSubscription:Subscription;

  constructor(private api:ApiService, private router:Router, private route:ActivatedRoute, private configService:ConfigService, private toastService:ToastService) {
  }

  ngOnInit() {

    this.loadStatuses();

    this.loadEventsCPV();
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.rok === undefined) return this.router.navigate(["./",this.getUpcomingTrimester()], { relativeTo: this.route, replaceUrl: true });
      if(params.trimestr === undefined) this.router.navigate(["./",{rok: params.rok, trimestr: 0}], { relativeTo: this.route, replaceUrl: true });

      this.year = Number(params.rok);
      this.trimester = Number(params.trimestr);

      this.dateFrom = DateTime.fromObject({ year: this.year, month: this.trimesterMonths[Number(this.trimester)][0], day:1});
      this.dateTill = DateTime.fromObject({ year: this.year, month: this.trimesterMonths[Number(this.trimester)][1], day:1}).endOf("month");

      this.createCalendar();
      this.loadEvents();

      if(this.eventsCPV){
        this.assignEvents(this.eventsCPV,"cpv");
        this.updateEventLevels("cpv");
      }
    });
  }

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  setTrimester(trimesterForm:NgForm){

    const formData = trimesterForm.value;

    this.router.navigate(["./", { rok:formData.year,trimestr: formData.trimester }], { relativeTo: this.route, replaceUrl: true });

  }
  
  getPreviousTrimester(){
    if(this.trimester === 0) return { rok: this.year - 1, trimestr: this.trimesterMonths.length - 1 };
    else return { rok: this.year, trimestr: this.trimester - 1 };
  }
  getNextTrimester(){
    if(this.trimester === this.trimesterMonths.length - 1) return { rok: this.year + 1, trimestr: 0 };
    else return { rok: this.year, trimestr: this.trimester + 1 };
  }
  
  getUpcomingTrimester(){
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let i = 0;
    while(new Date(currentYear,this.trimesterMonths[i][0],1) < currentDate){
      if(i < this.trimesterMonths.length - 1) i++;
      else { i = 0; currentYear++; }
    }
    return { rok: currentYear, trimestr: i };
  }

  createCalendar(){

    let currentDate = this.dateFrom;
    let month = new CalendarMonth(currentDate.month,currentDate.year)

    const calendar = [month];

    while(currentDate <= this.dateTill){
      
      if(currentDate.month !== month.number){
        month = new CalendarMonth(currentDate.month,currentDate.year);
        calendar.push(month);
      }

      month.days.push(new CalendarDay(currentDate));

      currentDate = currentDate.plus({days:1});
    }

    this.calendar = calendar;
  }

  async loadEvents(){

    var c = 0;

    const requestOptions = {
      filter: {
        dateTill: { $gte: this.dateFrom.toISO() },
        dateFrom: { $lte: this.dateTill.toISO() }
      },
      select: "_id name status type dateFrom dateTill timeFrom timeTill",
      limit: 100
    };

    const events = await this.api.get<Paginated<Event>>("events",requestOptions)
      .then(paginated => paginated.docs)
      .then(events => events.map(event => new CalendarEvent(event)));

    events.sort((a,b) => a.dateFrom.diff(b.dateFrom).valueOf());
    
    this.assignEvents(events,"own");
    
    this.updateEventLevels("own");

  }

  async loadStatuses(){
    const config = await this.configService.getConfig();
    this.statuses = config.events.statuses;
  }
  
  async loadEventsCPV(){
    this.eventsCPV = [];
    this.eventsCPV.push(...await this.api.get<CPVEvent[]>("cpv:kanoe").then(events => events.map(event => {
      event.name = "Kanoe.cz: " + event.name;
      return new CalendarEvent(event);
    })));
    this.eventsCPV.push(...await this.api.get<CPVEvent[]>("cpv:raft").then(events => events.map(event => {
      event.name = "Raft.cz: " + event.name;
      return new CalendarEvent(event);
    })));
    
    this.eventsCPV.sort((a,b) => a.dateFrom.diff(b.dateFrom).valueOf());
    
    this.assignEvents(this.eventsCPV,"cpv");
    this.updateEventLevels("cpv");
  }

  assignEvents(events,type){
    this.calendar.forEach(month => {
      const monthStart = month.days[0].date;
      const monthEnd = month.days[month.days.length - 1].date;
      month.events[type] = events.filter(event => event.dateTill >= monthStart && event.dateFrom <= monthEnd);
    });
    
  }

  updateEventLevels(type){

    this.calendar.forEach(month => {
      month.days.forEach(day => day.eventCount = 0);
      month.events[type].forEach(event => event.level = 0);
    });

    this.calendar.forEach(month => {
      month.events[type].forEach(event => {

        for(let date = event.dateFrom; date <= event.dateTill; date = date.plus({days:1})){

          if(date.month === month.number){
            
            const day = month.days[date.day - 1];   
            
            event.level = Math.max(event.level || 0,day.eventCount);
            day.eventCount = event.level + 1;
            
          }
        }
        
      });
    });
    
    
    
  }

  isWeekend(day:CalendarDay):boolean{
    return day.date.weekday >= 6;
  }

  isHoliday(day:CalendarDay):boolean{
    const dateString = (day.date.month + 1) + "-" + day.date.day;
    return this.holidays.indexOf(dateString) !== -1;
  }

  isSelected(day:CalendarDay){
    return this.selection && (day.date >= this.selection[0] && day.date <= this.selection[1]);
  }

  setEventStart(day:CalendarDay){
    this.selection = [day.date,day.date];
  }

  setEventEnd(day:CalendarDay){
    if(this.selection) this.selection[1] = day.date;
  }

  getEventLeft(event:CalendarEvent,month:CalendarMonth){
    return event.dateFrom.diff(month.days[0].date,"days").days / month.days.length;
  }

  getEventWidth(event:CalendarEvent,month:CalendarMonth){
    return (event.dateTill.diff(event.dateFrom,"days").days + 1) / month.days.length;
  }

  getEventClass(event:Event):string{
    const status = this.statuses.find(status => status.id === event.status);
    return status ? "bg-" + status.class : "bg-secondary";
  }

  getEventTooltip(event:Event):string{
    return event.name;
  }

  async createEvent(){

    // date select was not started - drag not started on a date or started on event
    if(!this.selection) return;

    this.selection.sort();

    var name = window.prompt("Bude vytvořena akce v termínu " + this.selection[0].toLocaleString() + " - " + this.selection[1].toLocaleString() + ". Zadejte její název:");   
    
    const eventData = {
      name,
      dateFrom: this.selection[0].toISODate(),
      dateTill: this.selection[1].toISODate()
    };

    await this.api.post("events",eventData)

    await this.loadEvents();

    this.toastService.toast("Akce vytvořena.")
    
    this.selection = undefined;
  }
} 