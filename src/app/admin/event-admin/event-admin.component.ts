import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Event } from "../../schema/event";
import { Member } from "../../schema/member";

@Component({
  selector: 'event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  
  event:Event;
  
  category:string;
  
  leaders:Member[] = [];

  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.event && (!this.event || this.event._id !== params.event)) this.loadEvent(params.event);
      
      this.category = params.cat;

    });
  }
  
  loadEvent(eventId:string):void{
    this.dataService.getEvent(eventId).then(event => this.event = event);
  }
  
  async saveEvent(form){
    this.event = await this.dataService.saveEvent(this.event._id,form.value)

    this.toastService.toast("Uloženo.");
    
    this.router.navigate(["../"],{relativeTo:this.route});
  }
  
  loadLeaders(){
    
  }

}
