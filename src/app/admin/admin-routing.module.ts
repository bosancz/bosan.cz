import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN ADMIN COMPONENT */
import { AdminComponent } from "./admin.component";

/* ADMIN MODULES */
import { CampsAdminComponent } from './views/camps-admin/camps-admin.component';
import { CampAdminComponent } from './views/camps-admin/camp-admin/camp-admin.component';

import { DataAdminComponent } from './views/data-admin/data-admin.component';

import { DocumentsViewComponent } from './views/documents-view/documents-view.component';

import { EventsAdminComponent } from './views/events-admin/events-admin.component';
import { EventAdminComponent } from './views/events-admin/event-admin/event-admin.component';

import { GalleryAdminComponent } from './views/gallery-admin/gallery-admin.component';
import { AlbumAdminComponent } from './views/gallery-admin/album-admin/album-admin.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/members-admin/member-admin/member-admin.component';

import { GroupsAdminComponent } from './views/groups-admin/groups-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';



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
      {path: 'akce/:event', redirectTo: "akce/:event/info", pathMatch: "full"},
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

      {path: '', redirectTo: "program", pathMatch: "full"},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
