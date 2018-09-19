import { Component, OnInit, Input } from '@angular/core';

import { Event } from "app/schema/event";

@Component({
  selector: 'event-admin-dashboard',
  templateUrl: './event-admin-dashboard.component.html',
  styleUrls: ['./event-admin-dashboard.component.scss']
})
export class EventAdminDashboardComponent implements OnInit {

  @Input() event:Event;
  
  constructor() { }

  ngOnInit() {
  }
  
  formatLeaders(leaders:any){
    if(!leaders.length) return ""
    if(leaders.length === 1) return leaders[0].nickname;
    return leaders.slice(0,leaders.length - 1).map(leader => leader.nickname).join(", ") + " a " + leaders[leaders.length - 1].nickname;
  }

}
