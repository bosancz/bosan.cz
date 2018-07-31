import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../modules/shared.module";

import { AdminComponent } from './admin.component';

import { AdminRoutingModule } from './admin-routing.module';

/* VIEWS */
import { CampsAdminComponent } from './views/camps-admin/camps-admin.component';
import { CampAdminComponent } from './views/camps-admin/camp-admin/camp-admin.component';
import { CampAdminBasicComponent } from './views/camps-admin/camp-admin/camp-admin-basic/camp-admin-basic.component';

import { EventsAdminComponent } from './views/events-admin/events-admin.component';
import { EventAdminComponent } from './views/events-admin/event-admin/event-admin.component';
import { EventAdminAttendeesComponent } from './views/events-admin/event-admin/event-admin-attendees/event-admin-attendees.component';
import { EventAdminInfoComponent } from './views/events-admin/event-admin/event-admin-info/event-admin-info.component';
import { EventAdminLeadersComponent } from './views/events-admin/event-admin/event-admin-leaders/event-admin-leaders.component';

import { GalleryAdminComponent } from './views/gallery-admin/gallery-admin.component';
import { AlbumAdminComponent } from './views/gallery-admin/album-admin/album-admin.component';
import { AlbumAdminMetadataComponent } from './views/gallery-admin/album-admin/album-admin-metadata/album-admin-metadata.component';
import { AlbumAdminUploadComponent } from './views/gallery-admin/album-admin/album-admin-upload/album-admin-upload.component';
import { AlbumAdminPhotosComponent } from './views/gallery-admin/album-admin/album-admin-photos/album-admin-photos.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/members-admin/member-admin/member-admin.component';
import { MemberAdminInfoComponent } from './views/members-admin/member-admin/member-admin-info/member-admin-info.component';

import { DocumentsViewComponent } from './views/documents-view/documents-view.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';

import { DataAdminComponent } from './views/data-admin/data-admin.component';

import { GroupsAdminComponent } from './views/groups-admin/groups-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';


/* COMMON COMPONENTS */

import { ContactsEditorComponent } from './components/contacts-editor/contacts-editor.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { UserAdminComponent } from './views/users-admin/user-admin/user-admin.component';

@NgModule({
  imports: [
    CommonModule,
    
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    
    /* VIEWS */
    EventsAdminComponent, EventAdminComponent, EventAdminAttendeesComponent, EventAdminInfoComponent, EventAdminLeadersComponent,
    GalleryAdminComponent, AlbumAdminComponent, AlbumAdminMetadataComponent, AlbumAdminUploadComponent, AlbumAdminPhotosComponent,
    MembersAdminComponent, MemberAdminComponent, MemberAdminInfoComponent,
    WebAdminComponent,
    DataAdminComponent,
    DocumentsViewComponent,
    CampsAdminComponent, CampAdminComponent, CampAdminBasicComponent,
    GroupsAdminComponent,
    UsersAdminComponent,
    
    /* SHARED */
    ContactsEditorComponent, MembersSelectComponent, UserAdminComponent,
    
  ]
})
export class AdminModule { }
