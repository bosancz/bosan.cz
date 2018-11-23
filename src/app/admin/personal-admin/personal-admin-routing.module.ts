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

      { path: 'prehled', component: MyDashboardComponent },

      { path: 'vedeni-akci', component: MyEventsComponent },
      
      { path: 'vedeni-oddilu', loadChildren: './views/my-group/my-group.module#MyGroupModule' },

      { path: 'sprava-programu', loadChildren: './views/program/program-admin.module#ProgramAdminModule' },
      
      { path: 'revizor', loadChildren: './views/auditor/auditor.module#AuditorModule' },

      { path: 'kanal', component: CanalRegistrationComponent },

      { path: 'dokumenty', component: DocumentsViewComponent },

      { path: 'admin/:cat', component: AccountAdminComponent },
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
