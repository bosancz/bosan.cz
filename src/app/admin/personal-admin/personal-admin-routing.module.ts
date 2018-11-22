import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalAdminComponent } from "./personal-admin.component";

/* VIEWS */
import { MyDashboardComponent } from "./views/my-dashboard/my-dashboard.component";
import { AccountAdminComponent } from "./views/account-admin/account-admin.component";
import { CanalRegistrationComponent } from "./views/canal-registration/canal-registration.component";
import { DocumentsViewComponent } from "./views/documents-view/documents-view.component";
import { MyEventsComponent } from "./views/my-events/my-events.component";

/* SERVICES */
import { ACLService } from "app/services/acl.service";

const routes:Routes = [
  {
    path: '',
    component: PersonalAdminComponent,
    children: [

      { path: 'prehled', component: MyDashboardComponent, canActivate: [ACLService] },

      { path: 'vedeni-akci', component: MyEventsComponent, canActivate: [ACLService] },
      
      { path: 'vedeni-oddilu', loadChildren: './views/my-group/my-group.module#MyGroupModule', canActivate: [ACLService] },

      { path: 'sprava-programu', loadChildren: './views/program/program-admin.module#ProgramAdminModule', canActivate: [ACLService] },
      
      { path: 'revizor', loadChildren: './views/auditor/auditor.module#AuditorModule', canActivate: [ACLService] },

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
export class PersonalAdminRoutingModule { }
