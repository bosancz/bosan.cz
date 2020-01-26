import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventsLeadComponent } from './views/events-lead/events-lead.component';
import { MyEventsComponent } from './views/my-events/my-events.component';

const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'vest-akci', component: EventsLeadComponent },
  { path: 'moje', component: MyEventsComponent },
  { path: ':event', component: EventsViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
