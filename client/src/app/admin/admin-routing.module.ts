import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
  {path: 'moje', loadChildren: () => import('./personal-admin/personal-admin.module').then(m => m.PersonalAdminModule)},
  
  {path: 'obsah', loadChildren: () => import('./content-admin/content-admin.module').then(m => m.ContentAdminModule), data: { permission: "admin" } },
  
  {path: '', redirectTo: "moje", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
