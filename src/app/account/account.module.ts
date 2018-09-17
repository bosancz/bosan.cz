import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../modules/shared.module";

/* MAIN */
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

/* VIEWS */
import { AccountAdminComponent } from './views/account-admin/account-admin.component';
import { DocumentsViewComponent } from './views/documents-view/documents-view.component';
import { AccountDashboardComponent } from './views/account-dashboard/account-dashboard.component';
import { MyEventsComponent } from './views/my-events/my-events.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    
    SharedModule
  ],
  declarations: [
    AccountComponent,
    
    /* VIEWS */ AccountAdminComponent, DocumentsViewComponent, AccountDashboardComponent, MyEventsComponent
  ]
})
export class AccountModule { }
