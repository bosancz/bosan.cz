import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { DataService } from "app/services/data.service";
import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { Event, EventRecurring } from "app/schema/event";
import { WebConfigRecurringType } from "app/schema/webconfig";

@Component({
  selector: 'event-admin-recurring',
  templateUrl: './event-admin-recurring.component.html',
  styleUrls: ['./event-admin-recurring.component.scss']
})
export class EventAdminRecurringComponent implements OnInit, OnChanges {

  @Input() event:Event;
  
  recurring:EventRecurring;
  
  recurringTypes:WebConfigRecurringType[];
  
  loading:boolean = false;
  
  @Output() saved:EventEmitter<void> = new EventEmitter<void>();
  
  constructor(private dataService:DataService, private configService:ConfigService, private router:Router, private toastService:ToastService) { }

  ngOnInit(){
    this.loadRecurringTypes();
  }
  
  loadRecurringTypes(){
    this.configService.getConfig().then(config => this.recurringTypes = config.events.recurringTypes);
  }
  
  ngOnChanges(changes:SimpleChanges) {
    if(changes.event) this.loadRecurring();
  }
  
  async loadRecurring(){
    if(!this.event) {
      this.recurring = null;
      return;
    }
    this.loading = true;
    this.recurring = await this.dataService.getEventRecurring(this.event._id,{events:true}).catch(err => {
      if(err.status !== 404) throw err;
      return null;
    });
    this.loading = false;
  }
  
  openInstance(instance:Event){
    this.router.navigate(["/interni/akce/" + instance._id + "/opakovani"]);
  }
  
  async createRecurring(form:NgForm){
    
    let recurringData = form.value;
    
    await this.dataService.createEventRecurring(this.event._id,recurringData);
    
    this.saved.emit();
    
    this.toastService.toast("Opakování nastaveno.");
  }
  
  async deleteRecurring(){
    await this.dataService.deleteEventRecurring(this.event._id);
    this.recurring = undefined;
    this.event.recurring = null;
    this.toastService.toast("Opakování smazáno.");
  }
  
  getNthDay(dateString:string|Date){
    return Math.ceil(new Date(dateString).getDate() / 7);
  }
}
