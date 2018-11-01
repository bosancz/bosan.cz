import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "app/modules/shared.module";

/* MAIN */
import { AccountComponent } from 'app/account/account.component';
import { AccountRoutingModule } from 'app/account/account-routing.module';

/* VIEWS */
import { AccountAdminComponent } from 'app/account/views/account-admin/account-admin.component';
import { AccountDashboardComponent } from 'app/account/views/account-dashboard/account-dashboard.component';
import { CanalRegistrationComponent } from './views/canal-registration/canal-registration.component';
import { DocumentsViewComponent } from 'app/account/views/documents-view/documents-view.component';
import { MyEventsComponent } from 'app/account/views/my-events/my-events.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    
    SharedModule
  ],
  declarations: [
    AccountComponent,
    
    /* VIEWS */ AccountAdminComponent, DocumentsViewComponent, AccountDashboardComponent, MyEventsComponent, CanalRegistrationComponent
  ]
})
export class AccountModule { }
