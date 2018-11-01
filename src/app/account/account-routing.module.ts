import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from "app/account/account.component";

/* VIEWS */
import { AccountDashboardComponent } from "app/account/views/account-dashboard/account-dashboard.component";
import { AccountAdminComponent } from "app/account/views/account-admin/account-admin.component";
import { CanalRegistrationComponent } from "app/account/views/canal-registration/canal-registration.component";
import { DocumentsViewComponent } from "app/account/views/documents-view/documents-view.component";
import { MyEventsComponent } from "app/account/views/my-events/my-events.component";
import { ProgramAdminComponent } from "app/account/views/program-admin/program-admin.component";

/* SERVICES */
import { ACLService } from "app/services/acl.service";

const routes:Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [

      { path: 'prehled', component: AccountDashboardComponent, canActivate: [ACLService] },

      { path: 'vedeni-akci', component: MyEventsComponent, canActivate: [ACLService] },

      { path: 'sprava-programu', loadChildren: 'app/account/views/program-admin/program-admin.module#ProgramAdminModule', canActivate: [ACLService] },

      { path: 'kanal', component: CanalRegistrationComponent, canActivate: [ACLService] },

      { path: 'dokumenty', component: DocumentsViewComponent, canActivate: [ACLService] },

      { path: 'admin/:cat', component: AccountAdminComponent,  canActivate: [ACLService] },
      { path: 'admin', redirectTo: "admin/info", pathMatch: "full"},

      { path: '', redirectTo: "admin/info", pathMatch: "full"},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
