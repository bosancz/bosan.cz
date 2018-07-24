import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN ADMIN COMPONENT */
import { AdminComponent } from "./admin.component";

/* ADMIN MODULES */
import { CampAdminComponent } from './camp-admin/camp-admin.component';
import { CampsAdminComponent } from './camps-admin/camps-admin.component';

import { DataAdminComponent } from './data-admin/data-admin.component';

import { DocumentsViewComponent } from './documents-view/documents-view.component';

import { EventAdminComponent } from './event-admin/event-admin.component';
import { EventsAdminComponent } from './events-admin/events-admin.component';

import { AlbumAdminComponent } from './album-admin/album-admin.component';
import { GalleryAdminComponent } from './gallery-admin/gallery-admin.component';

import { MembersAdminComponent } from './members-admin/members-admin.component';
import { MemberAdminComponent } from './member-admin/member-admin.component';

import { GroupsAdminComponent } from './groups-admin/groups-admin.component';

import { UsersAdminComponent } from './users-admin/users-admin.component';

import { WebAdminComponent } from './web-admin/web-admin.component';



const routes: Routes = [


  {
    path: '',
    component: AdminComponent,
    children: [
      {path: 'data', component: DataAdminComponent},

      {path: 'clenove/:member/:cat', component: MemberAdminComponent},
      {path: 'clenove/:member', redirectTo: "clenove/:member/osobni", pathMatch: "full"},
      {path: 'clenove', component: MembersAdminComponent},

      {path: 'dokumenty', component: DocumentsViewComponent},

      {path: 'akce/:event/:cat', component: EventAdminComponent},
      {path: 'akce/:camp', redirectTo: "akce/:camp/info", pathMatch: "full"},
      {path: 'akce', component: EventsAdminComponent},

      {path: 'fotogalerie/:album/:cat', component: AlbumAdminComponent},
      {path: 'fotogalerie/:album', redirectTo: "fotogalerie/:album/info", pathMatch: "full"},
      {path: 'fotogalerie', component: GalleryAdminComponent},

      {path: 'nastaveni-webu/:cat', component: WebAdminComponent},
      {path: 'nastaveni-webu', redirectTo: "nastaveni-webu/o-nas", pathMatch: "full"},

      {path: 'oddily', component: GroupsAdminComponent},

      {path: 'tabory/:camp/:cat', component: CampAdminComponent},
      {path: 'tabory/:camp', redirectTo: "tabory/:camp/info", pathMatch: "full"},
      {path: 'tabory', component: CampsAdminComponent},

      {path: 'uzivatele', component: UsersAdminComponent},      

      {path: '', redirectTo: "akce", pathMatch: "full"},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
