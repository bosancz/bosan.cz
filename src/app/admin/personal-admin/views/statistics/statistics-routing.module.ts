import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsComponent } from "./statistics.component";

import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: StatisticsComponent,
    children: [

      { path: 'akce', component: EventsDashboardComponent },

      { path: '', redirectTo: "akce", pathMatch: "full"}
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
