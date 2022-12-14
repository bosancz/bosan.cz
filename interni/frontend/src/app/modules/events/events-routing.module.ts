import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsViewComponent } from './views/events-view/events-view.component';

import { EventEditComponent } from './views/event-edit/event-edit.component';
import { EventsCreateComponent } from './views/events-create/events-create.component';
import { EventsViewAttendeesComponent } from './views/events-view/events-view-attendees/events-view-attendees.component';
import { EventsViewInfoComponent } from './views/events-view/events-view-info/events-view-info.component';
import { EventsViewRegistrationComponent } from './views/events-view/events-view-registration/events-view-registration.component';
import { EventsViewAccountingComponent } from './views/events-view/events-view-accounting/events-view-accounting.component';
import { EventsViewReportComponent } from './views/events-view/events-view-report/events-view-report.component';

const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'vytvorit', component: EventsCreateComponent },
  { path: ':event/upravit', component: EventEditComponent, },
  {
    path: ':event',
    component: EventsViewComponent,
    children: [
      { path: "info", component: EventsViewInfoComponent },
      { path: "ucastnici", component: EventsViewAttendeesComponent },
      { path: "prihlaska", component: EventsViewRegistrationComponent },
      { path: "uctovani", component: EventsViewAccountingComponent },
      { path: "report", component: EventsViewReportComponent },
      { path: "", redirectTo: "info", pathMatch: "full" }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
