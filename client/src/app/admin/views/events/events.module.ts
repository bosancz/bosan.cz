import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

import { EventsRoutingModule } from './events-routing.module';

/* SERVICES */
import { EventsService } from './services/events.service';

/* VIEWS */
import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsLeadComponent } from './views/events-lead/events-lead.component';
import { MyEventsComponent } from './views/my-events/my-events.component';

import { EventEditComponent } from './views/event-edit/event-edit.component';
import { EventEditInfoComponent } from './views/event-edit/event-edit-info/event-edit-info.component';
import { EventEditRegistrationComponent } from './views/event-edit/event-edit-registration/event-edit-registration.component';


/* COMPONENTS */
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventAttendeesListComponent } from './components/event-attendees-list/event-attendees-list.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventSubtypeSelectorComponent } from './components/event-subtype-selector/event-subtype-selector.component';
import { EventTypeSelectorComponent } from './components/event-type-selector/event-type-selector.component';
import { EventAttendeesListItemComponent } from './components/event-attendees-list-item/event-attendees-list-item.component';
import { EventEditAttendeesComponent } from './views/event-edit/event-edit-attendees/event-edit-attendees.component';
import { EventEditAccountingComponent } from './views/event-edit/event-edit-accounting/event-edit-accounting.component';
import { EventEditReportComponent } from './views/event-edit/event-edit-report/event-edit-report.component';
import { EventExpensesChartComponent } from './components/event-expenses-chart/event-expenses-chart.component';
import { EventsCreateComponent } from './events-create/events-create.component';

@NgModule({
  declarations: [
    EventsListComponent,
    EventsViewComponent,
    EventsLeadComponent,
    MyEventsComponent,
    EventEditComponent,
    EventEditInfoComponent,
    EventEditRegistrationComponent,

    EventAgeHistogramComponent,
    EventAttendeesListComponent,
    EventBirthdayListComponent,
    EventExpensesTableComponent,
    EventSubtypeSelectorComponent,
    EventTypeSelectorComponent,
    EventAttendeesListItemComponent,
    EventEditAttendeesComponent,
    EventEditAccountingComponent,
    EventEditReportComponent,
    EventExpensesChartComponent,
    EventsCreateComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,

    AppSharedModule,
    AdminSharedModule
  ],
  providers: [
    EventsService
  ]
})
export class EventsModule { }
