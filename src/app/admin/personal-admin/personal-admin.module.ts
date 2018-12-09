import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/modules/app-shared.module";
import { AdminSharedModule } from "app/admin/modules/admin-shared.module";

/* MAIN */
import { PersonalAdminComponent } from './personal-admin.component';
import { PersonalAdminRoutingModule } from './personal-admin-routing.module';

/* VIEWS */
import { MyDashboardComponent } from './views/my-dashboard/my-dashboard.component';
import { CanalRegistrationComponent } from './views/canal-registration/canal-registration.component';
import { DocumentsViewComponent } from './views/documents-view/documents-view.component';
import { MyEventsComponent } from './views/my-events/my-events.component';
import { MyAccountComponent } from './views/my-account/my-account.component';

import { MyGroupComponent } from './views/my-group/my-group.component';
import { MyGroupMembersComponent } from './views/my-group/my-group-members/my-group-members.component';

@NgModule({
  imports: [
    CommonModule,
    PersonalAdminRoutingModule,
    
    AppSharedModule,
    AdminSharedModule
  ],
  declarations: [
    PersonalAdminComponent,
    
    /* VIEWS */
    DocumentsViewComponent, MyDashboardComponent, MyEventsComponent, CanalRegistrationComponent, MyAccountComponent,
    MyGroupComponent, MyGroupMembersComponent
  ]
})
export class PersonalAdminModule { }
