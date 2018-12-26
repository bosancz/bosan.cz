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
import { LeadEventComponent } from './views/lead-event/lead-event.component';
import { MyEventComponent } from './views/my-event/my-event.component';
import { MyAccountInfoComponent } from './views/my-account/my-account-info/my-account-info.component';
import { MyAccountCredentialsComponent } from './views/my-account/my-account-credentials/my-account-credentials.component';
import { MyAccountNotificationsComponent } from './views/my-account/my-account-notifications/my-account-notifications.component';
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { MyAccountAppComponent } from './views/my-account/my-account-app/my-account-app.component';

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
    MyDashboardComponent,
    LeadEventComponent,
    MyEventsComponent, MyEventComponent,
    MyGroupComponent, MyGroupMembersComponent,
    MyAccountComponent, MyAccountInfoComponent, MyAccountCredentialsComponent, MyAccountNotificationsComponent,
    
    CanalRegistrationComponent,
    DocumentsViewComponent,
    
    /* COMPONENTS */
    EventAgeHistogramComponent, EventExpensesTableComponent, EventBirthdayListComponent, EventStatusBadgeComponent, MyAccountAppComponent
  ]
})
export class PersonalAdminModule { }
