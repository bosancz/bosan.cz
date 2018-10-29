import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";
import { Payment } from "app/schema/payment";

@Component({
  selector: 'event-admin-payments',
  templateUrl: './event-admin-payments.component.html',
  styleUrls: ['./event-admin-payments.component.scss']
})
export class EventAdminPaymentsComponent implements OnChanges {

  @Input() event:Event;
  
  payments:Payment[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnChanges(changes:SimpleChanges){
    if(changes.event) this.loadPayments(this.event._id);
  }
  
  async loadPayments(eventId:string){
    this.payments = await this.dataService.getEventPayments(eventId);
  }

}
