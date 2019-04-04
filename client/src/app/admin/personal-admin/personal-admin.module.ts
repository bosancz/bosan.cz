import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/shared/app-shared.module";
import { AdminSharedModule } from "app/admin/shared/admin-shared.module";

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
import { MyEventComponent } from './views/my-event/my-event.component';
import { MyAccountInfoComponent } from './views/my-account/my-account-info/my-account-info.component';
import { MyAccountCredentialsComponent } from './views/my-account/my-account-credentials/my-account-credentials.component';
import { MyAccountNotificationsComponent } from './views/my-account/my-account-notifications/my-account-notifications.component';
import { MyAccountAppComponent } from './views/my-account/my-account-app/my-account-app.component';
import { PaddlerCompetitionComponent } from './views/paddler-competition/paddler-competition.component';

/* MODALS */
import { LeadEventModalComponent } from './components/lead-event-modal/lead-event-modal.component';

/* COMPONENTS */
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventAttendeesListComponent } from './components/event-attendees-list/event-attendees-list.component';

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
    MyEventsComponent, MyEventComponent,
    MyGroupComponent, MyGroupMembersComponent,
    MyAccountComponent, MyAccountInfoComponent, MyAccountCredentialsComponent, MyAccountNotificationsComponent,
    PaddlerCompetitionComponent,
    
    CanalRegistrationComponent,
    DocumentsViewComponent,

    /* MODALS */
    LeadEventModalComponent,
    
    /* COMPONENTS */
    EventAgeHistogramComponent, EventExpensesTableComponent, EventBirthdayListComponent, MyAccountAppComponent, EventAttendeesListComponent
  ],
  entryComponents:[
    LeadEventModalComponent
  ]
})
export class PersonalAdminModule { }
