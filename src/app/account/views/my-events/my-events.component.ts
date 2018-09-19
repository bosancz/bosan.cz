import { Component, OnInit } from '@angular/core';

import { DataService } from "app/services/data.service";
import { AuthService } from "app/services/auth.service";

import { Event } from "app/schema/event";
import { Paginated } from "app/schema/paginated";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];
  
  constructor(private authService:AuthService, private dataService:DataService) { }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
    let userId:string = this.authService.user._id;
    
    let paginated = await this.dataService.getEvents({leader: userId});
    this.events = paginated.docs;
  }

}
