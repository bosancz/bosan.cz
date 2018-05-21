import { Component, OnInit, Input } from '@angular/core';
import { trigger, state,  style, animate, transition } from '@angular/animations';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";
import { Member } from "../../schema/member";
import { Group } from "../../schema/group";

class TimelineEvent extends Event {
  appeared?:boolean;
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
    
    let query:any = {
      from: new Date()
    };
    if(this.limit) query.limit = this.limit;
    if(this.limitDays) query.till = new Date(query.from.getTime() + (1000 * 60 * 60 * 24 * this.limitDays));
    
    this.dataService.getEvents(query)
      .then((events:TimelineEvent[]) => {
      
        //sort events by date asc, API does not guarantee sort order
        events.sort((a,b) => (new Date(a.dateFrom)).getTime() - (new Date(b.dateFrom)).getTime());
        
        // set the apeared variable, wil be true when scrolled into view
        events.forEach(event => event.appeared = false);
        
        //save events to component
        this.events = events;
      });
    
    this.dataService.getGroups({fields:"_id,color"})
      .then(groups => {
        this.groups = groups;
        this.groupColors = {};
        groups.forEach(group => this.groupColors[group._id] = group.color);
      })
  }
  
  filterEvents(events:TimelineEvent[], filteredGroup:string){
    if(!filteredGroup) return events;
    return events.filter(event => event.groups.indexOf(filteredGroup) !== -1);
  }
  
  joinLeaders(members:Member[]){
    let memberStrings = members.map(member => member.name + " (" + member.mobile + ")");
    return memberStrings.length > 1 ? (memberStrings.slice(0,memberStrings.length - 1).join(", ") + " a " + memberStrings[memberStrings.length - 1]) : memberStrings[0];
  }
}
