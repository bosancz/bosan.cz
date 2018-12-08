import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AppSharedModule } from "../modules/app-shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppSharedModule,
  ]
})
export class AdminModule { }
