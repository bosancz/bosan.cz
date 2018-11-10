import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/modules/app-shared.module";

/* MAIN */
import { PersonalAdminComponent } from './personal-admin.component';
import { PersonalAdminRoutingModule } from './personal-admin-routing.module';

/* VIEWS */
import { AccountAdminComponent } from './views/account-admin/account-admin.component';
import { MyDashboardComponent } from './views/my-dashboard/my-dashboard.component';
import { CanalRegistrationComponent } from './views/canal-registration/canal-registration.component';
import { DocumentsViewComponent } from './views/documents-view/documents-view.component';
import { MyEventsComponent } from './views/my-events/my-events.component';

@NgModule({
  imports: [
    CommonModule,
    PersonalAdminRoutingModule,
    
    AppSharedModule
  ],
  declarations: [
    PersonalAdminComponent,
    
    /* VIEWS */ AccountAdminComponent, DocumentsViewComponent, MyDashboardComponent, MyEventsComponent, CanalRegistrationComponent
  ]
})
export class PersonalAdminModule { }
