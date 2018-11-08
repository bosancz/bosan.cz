import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.scss']
})
export class EventPlanningComponent implements OnInit, OnDestroy {

  trimester:number;
  year:number;
  
  dateFrom:Date;
  dateTill:Date;

  calendar:Array<{days:Array<{events:Event[],date:Date}>}>;

  events:Event[] = [];

  holidays:any = ["1-1","5-1","5-8"];

  eventStartDate:Date;
  eventEndDate:Date;
  
  trimesterMonths = [ [1,4], [5,8], [9,12] ]; // trimster months (jan-may, ...)
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) {
  }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.rok === undefined) return this.router.navigate(["./",{rok: (new Date()).getFullYear(), trimestr: 0}], { relativeTo: this.route, replaceUrl: true });
      if(params.trimestr === undefined) this.router.navigate(["./",{rok: params.rok, trimestr: 0}], { relativeTo: this.route, replaceUrl: true });
      
      this.year = Number(params.rok);
      this.trimester = Number(params.trimestr);
      
      this.dateFrom = new Date(this.year,this.trimesterMonths[Number(this.trimester)][0] - 1,1);
      this.dateTill = new Date(this.year,this.trimesterMonths[Number(this.trimester)][1],0);
      
      this.createCalendar();
      this.loadEvents();
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  setTrimester(trimesterForm:NgForm){

    const formData = trimesterForm.value;

    this.router.navigate(["./", { rok:formData.year,trimestr: formData.trimester }], { relativeTo: this.route, replaceUrl: true });
    
  }

  createCalendar(){

    const currentDate = new Date(this.dateFrom.getTime());

    var month = {
      days: []
    }

    const calendar = [month];

    while(currentDate <= this.dateTill){

      if(month.days[0] && month.days[0].date.getMonth() !== currentDate.getMonth()){
        month = {days:[]};
        calendar.push(month);
      }

      month.days.push({
        events:[],
        date: new Date(currentDate.getTime())
      })

      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.calendar = calendar;
  }

  async loadEvents(){
    
    var c = 0;

    const requestOptions = {
      filter: {
        dateTill: { $gte: this.dateFrom.toISOString().split("T")[0] },
        dateFrom: { $lte: this.dateTill.toISOString().split("T")[0] }
      },
      select: "_id name dateFrom dateTill",
      limit: 100
    };

    let events = await this.dataService.getEvents(requestOptions).then(paginated => paginated.docs);
    
    this.calendar.forEach(month => {
      month.days.forEach(day => {
        const dayStart = day.date;
        const dayEnd = new Date(day.date); dayEnd.setHours(23,59,59);
        day.events = events.filter(event => event.dateFrom <= dayEnd && event.dateTill >= dayStart);
      });
    });
          
  }

  isWeekend(date:Date):boolean{
    return date.getDay() === 0 || date.getDay() === 6;
  }

  isHoliday(date:Date):boolean{
    const dateString = (date.getMonth() + 1) + "-" + date.getDate();
    return this.holidays.indexOf(dateString) !== -1;
  }

  isSelected(date:Date){
    return (this.eventStartDate && this.eventStartDate) && (date >= this.eventStartDate && date <= this.eventEndDate);
  }

  setEventStart(date:Date){
    this.eventStartDate = date;
    this.eventEndDate = date;
  }

  setEventEnd(date:Date){
    if(this.eventStartDate) this.eventEndDate = date;
  }

  createEvent(){
    
    // date select was not started - drag not started on a date or started on event
    if(!this.eventStartDate) return;

    var name = window.prompt("Bude vytvořena akce v termínu " + this.eventStartDate + " - " + this.eventEndDate + ". Zadejte její název:");

    this.eventStartDate = undefined;
    this.eventEndDate = undefined;
  }
  
  deleteEvent(e:MouseEvent,event:Event):void{
    
    e.stopPropagation();
    
    window.confirm("Opravdu chcete smazat akci " + event.name + "?");
  }
  
  openEvent(event:Event){
    this.router.navigate(["/interni/akce/" + event._id]);
  }
} 