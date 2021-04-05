import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { EventsRoutingModule } from './events-routing.module';

/* SERVICES */
import { EventsService } from './services/events.service';

/* VIEWS */
import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsCreateComponent } from './views/events-create/events-create.component';

import { EventEditComponent } from './views/event-edit/event-edit.component';
import { EventEditInfoComponent } from './views/event-edit/event-edit-info/event-edit-info.component';
import { EventEditRegistrationComponent } from './views/event-edit/event-edit-registration/event-edit-registration.component';
import { EventEditAttendeesComponent } from './views/event-edit/event-edit-attendees/event-edit-attendees.component';
import { EventEditAccountingComponent } from './views/event-edit/event-edit-accounting/event-edit-accounting.component';
import { EventEditReportComponent } from './views/event-edit/event-edit-report/event-edit-report.component';


/* COMPONENTS */
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventSubtypeSelectorComponent } from './components/event-subtype-selector/event-subtype-selector.component';
import { EventTypeSelectorComponent } from './components/event-type-selector/event-type-selector.component';
import { EventExpensesChartComponent } from './components/event-expenses-chart/event-expenses-chart.component';
import { MaterialModule } from 'app/shared/material.module';

@NgModule({
  declarations: [
    EventsListComponent,
    EventsViewComponent,
    EventEditComponent,
    EventEditInfoComponent,
    EventEditRegistrationComponent,

    EventAgeHistogramComponent,
    EventBirthdayListComponent,
    EventExpensesTableComponent,
    EventSubtypeSelectorComponent,
    EventTypeSelectorComponent,
    EventEditAttendeesComponent,
    EventEditAccountingComponent,
    EventEditReportComponent,
    EventExpensesChartComponent,
    EventsCreateComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    EventsService
  ]
})
export class EventsModule { }
