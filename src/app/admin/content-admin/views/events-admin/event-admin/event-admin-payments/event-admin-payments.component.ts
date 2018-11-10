import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { ApiService } from "app/services/api.service";

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
  
  constructor(private api:ApiService) { }

  ngOnChanges(changes:SimpleChanges){
    if(changes.event) this.loadPayments(this.event);
  }
  
  async loadPayments(event:Event){
    this.payments = await this.api.get<Payment[]>(event._links.payments);
  }

}
