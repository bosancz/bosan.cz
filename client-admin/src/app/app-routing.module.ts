import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'prehled', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: 'akce', loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule) },

  { path: 'galerie', loadChildren: () => import('./modules/albums/albums.module').then(m => m.AlbumsModule) },

  { path: 'databaze', loadChildren: () => import('./modules/members/members.module').then(m => m.MembersModule) },

  { path: 'program', loadChildren: () => import('./modules/program/program.module').then(m => m.ProgramModule) },

  { path: "blog", loadChildren: () => import("./modules/blogs/blogs.module").then(m => m.BlogsModule) },

  { path: 'statistiky', loadChildren: () => import('./modules/statistics/statistics.module').then(m => m.StatisticsModule) },

  { path: 'ucet', loadChildren: () => import('./modules/my-account/my-account.module').then(m => m.MyAccountModule) },

  { path: 'uzivatele', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },

  { path: 'nastaveni-webu', loadChildren: () => import('./modules/web-settings/web-settings.module').then(m => m.WebSettingsModule) },

  { path: '', redirectTo: "prehled", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
