import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

import { EventsRoutingModule } from './events-routing.module';

import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventAttendeesListComponent } from './components/event-attendees-list/event-attendees-list.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventSubtypeSelectorComponent } from './components/event-subtype-selector/event-subtype-selector.component';
import { EventTypeSelectorComponent } from './components/event-type-selector/event-type-selector.component';
import { EventRegistrationComponent } from './components/event-registration/event-registration.component';
import { EventAttendeesListItemComponent } from './components/event-attendees-list-item/event-attendees-list-item.component';

import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsLeadComponent } from './views/events-lead/events-lead.component';
import { MyEventsComponent } from './views/my-events/my-events.component';

@NgModule({
  declarations: [
    EventsListComponent,
    EventsViewComponent,
    EventsLeadComponent,
    MyEventsComponent,

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
    EventsRoutingModule,

    AppSharedModule,
    AdminSharedModule
  ]
})
export class EventsModule { }
