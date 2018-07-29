import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../../../services/data.service";
import { AuthService } from "../../../services/auth.service";
import { ToastService } from "../../../services/toast.service";

import { Event } from "../../../schema/event";

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit, OnDestroy {

  statuses:any = {
    "public": "veřejná",
    "draft": "v přípravě"
  }
  events:Event[] = [];
  
  viewsOptions:any = {
    "future": {dateTill: {$gte: new Date()}},
    "past": {dateTill: {$lt: new Date()}},
    "my": { leaders: null },
    "all": {}
  };
  
  createEventModalRef: BsModalRef;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private authService:AuthService, private modalService: BsModalService) {
    
    this.viewsOptions.my.leaders = authService.user._id;
  }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || !this.viewsOptions[params.view]) return this.router.navigate(["./", {view: "future"}], {relativeTo: this.route});
      
      this.loadEvents(params.view);
    });
    
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadEvents(view:string){
    
    let options = Object.assign({},{leaders:1},this.viewsOptions[view]);
    
    this.events = await this.dataService.getEvents({leaders:1});
  }
  
  getEventLink(event:Event):string{
    return './' + event._id;
  }
  
  openEvent(event:Event):void{
    this.router.navigate([this.getEventLink(event)], {relativeTo: this.route});
  }

  openCreateEventModal(template: TemplateRef<any>){
    this.createEventModalRef = this.modalService.show(template);
  }
  
  async createEvent(form:NgForm){
    // get data from form
    var eventData = form.value;
    // create the event and wait for confirmation
    var event = await this.dataService.createEvent(eventData);
    // close the modal
    this.createEventModalRef.hide();
    // show the confrmation
    this.toastService.toast("Akce vytvořena a uložena.");
    // open the event
    this.router.navigate(["./" + event._id], {relativeTo: this.route})
  }
  
  getLeadersString(event:Event){
    return event.leaders.map(item => item.nickname).join(", ");
  }

}
