import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN ADMIN COMPONENT */
import { AdminComponent } from "./admin.component";

/* ADMIN MODULES */
import { CampsAdminComponent } from './views/camps-admin/camps-admin.component';
import { CampAdminComponent } from './views/camps-admin/camp-admin/camp-admin.component';

import { EventsAdminComponent } from './views/events-admin/events-admin.component';
import { EventAdminComponent } from './views/events-admin/event-admin/event-admin.component';

import { GalleryAdminComponent } from './views/gallery-admin/gallery-admin.component';
import { AlbumsAdminComponent } from './views/gallery-admin/albums-admin/albums-admin.component';
import { AlbumAdminComponent } from './views/gallery-admin/album-admin/album-admin.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/members-admin/member-admin/member-admin.component';

import { ServerAdminComponent } from './views/server-admin/server-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';
import { UserAdminComponent } from './views/users-admin/user-admin/user-admin.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';


/* SERVICES */
import { ACLService } from "../services/acl.service";


const routes: Routes = [


  {
    path: '',
    component: AdminComponent,
    children: [
      {path: 'clenove/:member/:cat', component: MemberAdminComponent, canActivate: [ACLService]},
      {path: 'clenove/:member', redirectTo: "clenove/:member/osobni", pathMatch: "full"},
      {path: 'clenove', component: MembersAdminComponent, canActivate: [ACLService]},

      {path: 'akce/:event/:cat', component: EventAdminComponent, canActivate: [ACLService]},
      {path: 'akce/:event', redirectTo: "akce/:event/upravit", pathMatch: "full"},
      {path: 'akce', component: EventsAdminComponent, canActivate: [ACLService]},

      {path: 'galerie/:album/:cat', component: AlbumAdminComponent, canActivate: [ACLService]},
      {path: 'galerie/:album', redirectTo: "galerie/:album/prehled", pathMatch: "full"},
      {path: 'galerie', component: GalleryAdminComponent, canActivate: [ACLService]},

      {path: 'tabory/:camp/:cat', component: CampAdminComponent, canActivate: [ACLService]},
      {path: 'tabory/:camp', redirectTo: "tabory/:camp/upravit", pathMatch: "full"},
      {path: 'tabory', component: CampsAdminComponent, canActivate: [ACLService]},

      {path: 'nastaveni-webu/:cat', component: WebAdminComponent, canActivate: [ACLService]},
      {path: 'nastaveni-webu', redirectTo: "nastaveni-webu/obecne", pathMatch: "full"},

      {path: 'nastaveni-serveru/:cat', component: ServerAdminComponent, canActivate: [ACLService]},
      {path: 'nastaveni-serveru', redirectTo: "nastaveni-serveru/obecne", pathMatch: "full"},

      {path: 'uzivatele/:user/:cat', component: UserAdminComponent, canActivate: [ACLService]},      
      {path: 'uzivatele/:user', redirectTo: "uzivatele/:user/ucet", pathMatch: "full"}, 
      {path: 'uzivatele', component: UsersAdminComponent, canActivate: [ACLService]},   
      
      {path: '', redirectTo: "akce", pathMatch: "full", canActivate: [ACLService]},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
