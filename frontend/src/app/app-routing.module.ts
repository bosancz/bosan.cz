import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AclGuard } from './core/guards/acl.guard';

import { LoginComponent } from './core/views/login/login.component';
import { NotFoundComponent } from './core/views/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { hideMenu: true } },

  { path: '', canLoad: [AclGuard], data: { permission: "dashboard" }, loadChildren: () => import('./modules/home/home.module').then(m => m.DashboardModule) },

  { path: 'akce', canLoad: [AclGuard], data: { permission: "events" }, loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule) },

  { path: 'galerie', canLoad: [AclGuard], data: { permission: "albums" }, loadChildren: () => import('./modules/albums/albums.module').then(m => m.AlbumsModule) },

  { path: 'databaze', canLoad: [AclGuard], data: { permission: "members" }, loadChildren: () => import('./modules/members/members.module').then(m => m.MembersModule) },

  { path: 'program', canLoad: [AclGuard], data: { permission: "program" }, loadChildren: () => import('./modules/program/program.module').then(m => m.ProgramModule) },

  { path: "blog", canLoad: [AclGuard], data: { permission: "blogs" }, loadChildren: () => import("./modules/blogs/blogs.module").then(m => m.BlogsModule) },

  { path: 'statistiky', canLoad: [AclGuard], data: { permission: "statistics" }, loadChildren: () => import('./modules/statistics/statistics.module').then(m => m.StatisticsModule) },

  { path: 'ucet', canLoad: [AclGuard], data: { permission: "account" }, loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },

  { path: 'uzivatele', canLoad: [AclGuard], data: { permission: "users" }, loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },

  { path: 'web', canLoad: [AclGuard], data: { permission: "web" }, loadChildren: () => import('./modules/web/web.module').then(m => m.WebModule) },

  // { path: '', redirectTo: "prehled", pathMatch: "full" },

  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: "always" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
