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
import { WebConfigEventType } from "../../../schema/webconfig";
import { Paginated } from "../../../schema/paginated";

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit, OnDestroy {

  statuses:any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  }
  
  events:Event[] = [];
  
  pages:number = 1;
  page:number = 1;
  
  view:string;
  
  views:any = {
    "future": {dateFrom: (new Date()).toISOString().split("T")[0], sort: "dateFrom order"},
    "past": {dateTill: (new Date()).toISOString().split("T")[0], sort: "-dateFrom -order"},
    "my": { leader: null, sort: "-dateFrom -order" },
    "noleader": { noleader: 1, sort: "dateFrom order"},
    "all": { sort: "-dateFrom -order"}
  };
  
  defaultOptions = {
    page:1,
    sort:"-dateFrom",
    leaders:1,
    limit: 50,
    search:undefined,
    status:"all",
    dateFrom:undefined,
    dateTill:undefined
  }
  
  options = this.defaultOptions;
  
  openFilter:boolean = false;
  
  eventTypes:{[s:string]:WebConfigEventType[]} = {};
  
  createEventModalRef: BsModalRef;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private authService:AuthService, private modalService: BsModalService) {
    
    this.views.my.leader = authService.user.member;
  }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || !this.views[params.view]) return this.router.navigate(["./", {view: "future"}], {relativeTo: this.route, replaceUrl: true});
      
      this.view = params.view;
      this.page = params.page || 1;
      
      // set options
      this.options = JSON.parse(JSON.stringify(this.defaultOptions));
      Object.assign(this.options,this.views[this.view] || {});
      this.options.page = this.page;
      
      this.loadEvents();
    });
    
    this.loadEventTypes();
    
    
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadEvents(){
    let paginated:Paginated<Event> = await this.dataService.getEvents(this.options);
    this.events = paginated.docs;
    this.pages = paginated.pages;
  }
  
  async loadEventTypes(){
    let config = await this.dataService.getConfig();
    this.eventTypes = config.events.types.reduce((acc,cur) => ({...acc,[cur.name]:cur}),{});
  }
  
  
  openEvent(event:Event):void{
    this.router.navigate(['/interni/akce/' + event._id], {relativeTo: this.route});
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
    this.router.navigate(["/interni/akce/" + event._id + "/upravit"])
  }
  
  getLeadersString(event:Event){
    return event.leaders.map(item => item.nickname).join(", ");
  }
  
  getPages(){
    var pages = [];
    for(var i = 1; i <= this.pages; i++) pages.push(i)
    return pages;
  }
  
  getPageLink(page:number){
    var params:any = {view:this.view,page:page};
    return ["./",params];
  }

}
