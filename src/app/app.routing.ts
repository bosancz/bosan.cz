import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { EventScheduleComponent } from './views/event-schedule/event-schedule.component';

const appRoutes:Routes = [
  {path: 'program', component: EventScheduleComponent},
  
  {path: 'uvod', component: FrontPageComponent},
  
  {path: '', redirectTo: 'uvod', pathMatch: 'full'},
  
];

export const AppRouting = RouterModule.forRoot(appRoutes);