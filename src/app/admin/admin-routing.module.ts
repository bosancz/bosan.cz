import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
  {path: 'moje', loadChildren: './personal-admin/personal-admin.module#PersonalAdminModule'},
  
  {path: 'obsah', loadChildren: './content-admin/content-admin.module#ContentAdminModule'},
  
  {path: '', redirectTo: "obsah", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
