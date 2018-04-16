import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './app/views/front-page/front-page.component';

const appRoutes: Routes = [
  {path: '', component: FrontPageComponent},
];

export const routing = RouterModule.forRoot(appRoutes);