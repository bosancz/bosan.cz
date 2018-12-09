import { Component, OnInit } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";

import { Payment } from "app/schema/payment";

@Component({
  selector: 'payments-admin',
  templateUrl: './payments-admin.component.html',
  styleUrls: ['./payments-admin.component.scss']
})
export class PaymentsAdminComponent implements OnInit {

  payments = [];
  
  paymentTypes = [];
  
  filter = {
    member: "",
    event: "",
    type: ""
  }
  
  openFilter = false;
  
  constructor(private api:ApiService, private configService:ConfigService) {}

  ngOnInit() {
    this.loadPaymentTypes();
    this.loadPayments();
  }

  async loadPaymentTypes(){
    const config = await this.configService.getConfig();
    this.paymentTypes = config.payments.types.map(type => type.name);
  }
  
  async loadPayments(){
    this.payments = await this.api.get<Payment[]>("payments")
  }
}
