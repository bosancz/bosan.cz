import { Component, OnInit, Input } from '@angular/core';
import { trigger, state,  style, animate, transition } from '@angular/animations';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";
import { Member } from "../../schema/member";
import { Group } from "../../schema/group";

class TimelineEvent extends Event {
  appeared?:boolean = false;
}

@Component({
  selector: 'events-timeline',
  templateUrl: "events-timeline.template.html",
  styleUrls: ["events-timeline.style.css"],
  animations: [
    trigger("eventWow", [
      transition('notappeared => appeared', [style({opacity:0}),animate('500ms 100ms',style({opacity:1}))])
    ]),
    trigger("eventHide", [
      state("visible", style({opacity:1, display: 'block'})),
      state("hidden", style({opacity:0, display: 'none'})),
      transition('hidden => visible', [
        style({display:'block',height:'0'}),
        animate('150ms ease-in', style({height:'250px'})),
        style({transform:'translateX(25%)', opacity:0, height:'auto'}),
        animate('250ms ease-out', style({transform:'translateX(0%)', opacity:1}))
      ]),
      transition('visible => hidden', [
        animate('250ms ease-in', style({transform:'translateX(25%)', opacity:0})),
        style({height:'250px'}),
        animate('150ms ease-in', style({height:'0'})),
        style({display:'none'})
      ])
    ])
  ]
})
export class EventsTimelineComponent implements OnInit {

  @Input() limit:number;
  @Input() limitDays:number;
  
  @Input() groupsFilter:boolean;
  
  @Input() full:boolean = false;
  
  events:TimelineEvent[]= [];
  
  groups:Group[] = [];
  groupColors:any = {};
  
  filteredGroup:string;

  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    this.events = await this.dataService.getUpcomingEvents();

    // set the apeared variable, wil be true when scrolled into view
    this.events.forEach(event => event.appeared = false);
  }
  
  filterEvents(events:TimelineEvent[], filteredGroup:string){
    if(!filteredGroup) return events;
    return events.filter(event => event.groups.indexOf(filteredGroup) !== -1);
  }
}
