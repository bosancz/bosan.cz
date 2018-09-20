import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "app/services/data.service";
import { AuthService } from "app/services/auth.service";
import { ToastService } from "app/services/toast.service";

import { Event } from "app/schema/event";
import { WebConfigEventType } from "app/schema/webconfig";
import { Paginated } from "app/schema/paginated";

@Component({
  selector: 'events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent implements OnInit, OnDestroy {

  statuses:any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  };
  
  events:Event[] = [];
  
  pages:number = 1;
  page:number = 1;
  
  view:string;
  
  today:string = (new Date()).toISOString().split("T")[0];
  
  views:any = {
    "future": { dateFrom: {$gte: this.today}, recurring: null },
    "past": { dateFrom: {$lte: this.today}, recurring:null },
    "my": { dateFrom: {$gte: undefined}, leaders: null /* filled in in constructor */, recurring: null },
    "noleader": { dateFrom: {$gte: this.today}, leaders: {$size:0}, recurring: null },
    "all": { dateFrom: {$gte: undefined}, recurring: null },
    "recurring": { dateFrom: {$gte: undefined}, recurring: { $ne: null } }
  };
  
  options = {
    page:1,
    sort:"dateFrom",
    populate: ["leaders"],
    limit: 50,
    search:undefined,
    filter:{}
  };
  
  openFilter:boolean = false;
  
  eventTypes:{[s:string]:WebConfigEventType[]} = {};
  
  createEventModalRef:BsModalRef;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private authService:AuthService, private modalService:BsModalService) {
    
    this.views.my.leaders = authService.user.member;
  }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || this.views[params.view] === undefined) return this.router.navigate(["./", {view: "future"}], {relativeTo: this.route, replaceUrl: true});
      
      this.view = params.view;
      this.page = params.page || 1;
      
      // set options
      this.options.filter = this.views[this.view] || {};
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

  openCreateEventModal(template:TemplateRef<any>){
    this.createEventModalRef = this.modalService.show(template);
  }
  
  async createEvent(form:NgForm){
    // get data from form
    let eventData = form.value;
    // create the event and wait for confirmation
    let event = await this.dataService.createEvent(eventData);
    // close the modal
    this.createEventModalRef.hide();
    // show the confrmation
    this.toastService.toast("Akce vytvořena a uložena.");
    // open the event
    this.router.navigate(["/interni/akce/" + event._id + "/upravit"]);
  }
  
  getLeadersString(event:Event){
    return event.leaders.map(item => item.nickname).join(", ");
  }
  
  getPages(){
    let pages = [];
    for(let i = 1; i <= this.pages; i++) pages.push(i);
    return pages;
  }
  
  getPageLink(page:number){
    let params:any = {view:this.view,page:page};
    return ["./",params];
  }
  
  setSort(field:string){
    let asc = this.options.sort.charAt(0) !== "-";
    let currentField = asc ? this.options.sort : this.options.sort.substring(1);
    
    if(field === currentField) this.options.sort = asc ? "-" + field : field;
    else this.options.sort = field;
    
    this.loadEvents();
  }

}
