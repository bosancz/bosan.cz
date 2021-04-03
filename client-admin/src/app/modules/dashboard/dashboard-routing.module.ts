import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { DashboardCalendarComponent } from './views/dashboard-calendar/dashboard-calendar.component';
import { DashboardLeadEventComponent } from './views/dashboard-lead-event/dashboard-lead-event.component';
import { DashboardNewsComponent } from './views/dashboard-news/dashboard-news.component';
import { DashboardMyEventsComponent } from './views/dashboard-my-events/dashboard-my-events.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "novinky", component: DashboardNewsComponent },
      { path: "kalendar", component: DashboardCalendarComponent },
      { path: "moje-akce", component: DashboardMyEventsComponent },
      { path: "vest-akci", component: DashboardLeadEventComponent },
      { path: "", redirectTo: "kalendar", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
