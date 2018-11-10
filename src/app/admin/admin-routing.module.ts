import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ACLService } from "app/services/acl.service";

const routes: Routes = [
  
  {path: 'moje', loadChildren: './personal-admin/personal-admin.module#PersonalAdminModule', canActivate: [ACLService]},
  
  {path: 'obsah', loadChildren: './content-admin/content-admin.module#ContentAdminModule', canActivate: [ACLService]},
  
  {path: '', redirectTo: "obsah", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
