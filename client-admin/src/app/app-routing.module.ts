import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'prehled', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: 'akce', loadChildren: () => import('./views/events/events.module').then(m => m.EventsModule) },

  { path: 'galerie', loadChildren: () => import('./views/albums/albums.module').then(m => m.AlbumsModule) },

  { path: 'databaze', loadChildren: () => import('./views/members/members.module').then(m => m.MembersModule) },

  { path: 'program', loadChildren: () => import('./views/program/program.module').then(m => m.ProgramModule) },

  { path: 'statistiky', loadChildren: () => import('./views/statistics/statistics.module').then(m => m.StatisticsModule) },

  { path: 'ucet', loadChildren: () => import('./views/my-account/my-account.module').then(m => m.MyAccountModule) },

  { path: 'uzivatele', loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule) },

  { path: 'nastaveni-webu', loadChildren: () => import('./views/web-settings/web-settings.module').then(m => m.WebSettingsModule) },

  { path: '', redirectTo: "prehled", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
