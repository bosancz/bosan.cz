import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSettingsComponent } from './web-settings.component';

const routes: Routes = [
  { path: ':cat', component: WebSettingsComponent },
  { path: '', redirectTo: "general", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSettingsRoutingModule { }
