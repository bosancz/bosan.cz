import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsViewComponent } from './views/events-view/events-view.component';

import { EventEditAccountingComponent } from './views/event-edit/event-edit-accounting/event-edit-accounting.component';
import { EventEditAttendeesComponent } from './views/event-edit/event-edit-attendees/event-edit-attendees.component';
import { EventEditComponent } from './views/event-edit/event-edit.component';
import { EventEditInfoComponent } from './views/event-edit/event-edit-info/event-edit-info.component';
import { EventEditRegistrationComponent } from './views/event-edit/event-edit-registration/event-edit-registration.component';
import { EventEditReportComponent } from './views/event-edit/event-edit-report/event-edit-report.component';
import { EventsCreateComponent } from './views/events-create/events-create.component';

const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'vytvorit', component: EventsCreateComponent },
  {
    path: ':event/upravit', component: EventEditComponent,
    children: [
      { path: "info", component: EventEditInfoComponent },
      { path: "prihlaska", component: EventEditRegistrationComponent },
      { path: "ucastnici", component: EventEditAttendeesComponent },
      { path: "uctovani", component: EventEditAccountingComponent },
      { path: "report", component: EventEditReportComponent },
      { path: "", redirectTo: "info", pathMatch: "full" }
    ]
  },
  { path: ':event', component: EventsViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
