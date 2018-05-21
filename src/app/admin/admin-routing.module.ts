import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from "./admin.component";

import { CampAdminComponent } from './camp-admin/camp-admin.component';
import { DataAdminComponent } from './data-admin/data-admin.component';
import { EventsAdminComponent } from './events-admin/events-admin.component';
import { GalleryAdminComponent } from './gallery-admin/gallery-admin.component';
import { MembersAdminComponent } from './members-admin/members-admin.component';
import { WebAdminComponent } from './web-admin/web-admin.component';

import { DocumentsViewComponent } from './documents-view/documents-view.component';

const routes: Routes = [


  {
    path: '',
    component: AdminComponent,
    children: [
      {path: 'data', component: DataAdminComponent},
      
      {path: 'databaze', component: MembersAdminComponent},

      {path: 'dokumenty', component: DocumentsViewComponent},
      
      {path: 'program', component: EventsAdminComponent},

      {path: 'fotogalerie', component: GalleryAdminComponent},

      {path: 'nastaveni-webu/:cat', component: WebAdminComponent},
      {path: 'nastaveni-webu', redirectTo: "nastaveni-webu/o-nas", pathMatch: "full"},
            
      {path: 'tabor', component: CampAdminComponent},

      {path: '', redirectTo: "program", pathMatch: "full"},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
