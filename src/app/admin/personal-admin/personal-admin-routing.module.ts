import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalAdminComponent } from "./personal-admin.component";

/* VIEWS */
import { MyDashboardComponent } from "./views/my-dashboard/my-dashboard.component";
import { MyAccountComponent } from "./views/my-account/my-account.component";
import { CanalRegistrationComponent } from "./views/canal-registration/canal-registration.component";
import { DocumentsViewComponent } from "./views/documents-view/documents-view.component";
import { LeadEventComponent } from "./views/lead-event/lead-event.component";

import { MyEventsComponent } from "./views/my-events/my-events.component";
import { MyEventComponent } from "./views/my-event/my-event.component";

import { MyGroupComponent } from './views/my-group/my-group.component';
import { MyGroupMembersComponent } from './views/my-group/my-group-members/my-group-members.component';

const routes:Routes = [
  {
    path: '',
    component: PersonalAdminComponent,
    children: [

      { path: 'prehled', component: MyDashboardComponent },

      { path: 'ved-akci', component: LeadEventComponent },
      
      { path: 'akce/:akce', component: MyEventComponent },
      { path: 'akce', component: MyEventsComponent },
      
      {
        path: 'oddil', component: MyGroupComponent,
        children: [
          { path: 'clenove', component: MyGroupMembersComponent },
          { path: '', redirectTo: "clenove", pathMatch: "full" }
        ]
      },

      { path: 'program', loadChildren: './views/program/program-admin.module#ProgramAdminModule' },
      
      { path: 'revizor', loadChildren: './views/auditor/auditor.module#AuditorModule' },

      { path: 'kanal', component: CanalRegistrationComponent },

      { path: 'dokumenty', component: DocumentsViewComponent },

      { path: 'ucet/:cat', component: MyAccountComponent },
      { path: 'ucet', redirectTo: "ucet/info", pathMatch: "full"},

      { path: '', redirectTo: "prehled", pathMatch: "full"},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalAdminRoutingModule { }
