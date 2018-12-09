import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { AuthService } from "app/services/auth.service";

import { Paginated } from "app/schema/paginated";
import { Event } from "app/schema/event";

@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  events:Event[] = [];
  
  userSubscription:Subscription;
  
  constructor(private authService:AuthService, private api:ApiService) { 
  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => this.loadMyEvents(user.member));
  }
  
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
  
  async loadMyEvents(memberId:string){
      
    this.events = await this.api.get<Event[]>("me:events");
    
    this.events.forEach(event => {
      event.dateFrom = new Date(event.dateFrom);
      event.dateTill = new Date(event.dateTill);
    });
    
    this.events.sort((a,b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    
  }

}
