import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* MODULES */
import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

/* COMPONENTS */
import { EventComponent } from './event.component';
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventAttendeesListComponent } from './components/event-attendees-list/event-attendees-list.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventSubtypeSelectorComponent } from './components/event-subtype-selector/event-subtype-selector.component';
import { EventTypeSelectorComponent } from './components/event-type-selector/event-type-selector.component';
import { EventRegistrationComponent } from './components/event-registration/event-registration.component';
import { EventAttendeesListItemComponent } from './components/event-attendees-list-item/event-attendees-list-item.component';
import { MemberInfoModalComponent } from 'app/shared/modals/member-info-modal/member-info-modal.component';

@NgModule({
  declarations: [
    /* COMPONENTS */
    EventComponent,
    EventAgeHistogramComponent,
    EventAttendeesListComponent,
    EventBirthdayListComponent,
    EventExpensesTableComponent,
    EventSubtypeSelectorComponent,
    EventTypeSelectorComponent,
    EventRegistrationComponent,
    EventAttendeesListItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    
    AppSharedModule,
    AdminSharedModule
  ]
})
export class EventModule { }
