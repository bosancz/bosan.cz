import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardMyEventsComponent } from './views/dashboard-my-events/dashboard-my-events.component';



const routes: Routes = [
  { path: "", component: DashboardComponent },
  // { path: "novinky", component: DashboardNewsComponent },
  // { path: "akce", component: DashboardEventsComponent },
  { path: "moje-akce", component: DashboardMyEventsComponent },
  // { path: "vest-akci", component: DashboardLeadEventComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
