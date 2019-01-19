import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditorComponent } from "./auditor.component";

import { EventReportsComponent } from './event-reports/event-reports.component';
import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: AuditorComponent,
    children: [

      { path: 'reporty', component: EventReportsComponent },
      
      { path: 'akce', component: EventsDashboardComponent },

      { path: '', redirectTo: "akce", pathMatch: "full"}
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditorRoutingModule { }
