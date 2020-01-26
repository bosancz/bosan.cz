import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';

import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

@NgModule({
  declarations: [
    DashboardComponent    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class DashboardModule { }
