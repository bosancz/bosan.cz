import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { Event } from "app/core/schema/event";
import { Payment } from "app/core/schema/payment";

@Component({
  selector: 'event-admin-payments',
  templateUrl: './event-admin-payments.component.html',
  styleUrls: ['./event-admin-payments.component.scss']
})
export class EventAdminPaymentsComponent {

  @Input() set event(event:Event){
    this.loadPayments(event);
  }
  
  @Output() saved:EventEmitter<any> = new EventEmitter();
  
  payments:Payment[] = [];
  
  constructor(private api:ApiService) { }

  async loadPayments(event:Event){
    this.payments = await this.api.get<Payment[]>(event._links.payments);
  }

}
