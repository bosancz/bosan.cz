import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../modules/shared.module";

import { AdminComponent } from './admin.component';

import { AdminRoutingModule } from './admin-routing.module';

import { CampAdminComponent } from './camp-admin/camp-admin.component';
import { DataAdminComponent } from './data-admin/data-admin.component';
import { EventsAdminComponent } from './events-admin/events-admin.component';
import { GalleryAdminComponent } from './gallery-admin/gallery-admin.component';
import { MembersAdminComponent } from './members-admin/members-admin.component';
import { WebAdminComponent } from './web-admin/web-admin.component';

import { DocumentsViewComponent } from './documents-view/documents-view.component';

import { ConfigAboutComponent } from './web-admin/config-about/config-about.component';
import { ConfigDocumentsComponent } from './web-admin/config-documents/config-documents.component';

import { ContactsEditorComponent } from './web-admin/contacts-editor/contacts-editor.component';
import { GroupsAdminComponent } from './groups-admin/groups-admin.component';
import { CampAdminBasicComponent } from './camp-admin/camp-admin-basic/camp-admin-basic.component';
import { CampsAdminComponent } from './camps-admin/camps-admin.component';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { AlbumAdminComponent } from './album-admin/album-admin.component';
import { AlbumAdminMetadataComponent } from './album-admin/album-admin-metadata/album-admin-metadata.component';
import { AlbumAdminUploadComponent } from './album-admin/album-admin-upload/album-admin-upload.component';
import { AlbumAdminPhotosComponent } from './album-admin/album-admin-photos/album-admin-photos.component';

@NgModule({
  imports: [
    CommonModule,
    
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    
    /* VIEWS */ EventsAdminComponent, GalleryAdminComponent, MembersAdminComponent, WebAdminComponent, DataAdminComponent, DocumentsViewComponent, CampAdminComponent, GroupsAdminComponent,
    
    /* WEB CONFIG */ ConfigDocumentsComponent, ConfigAboutComponent,
    
    /* SHARED */ ContactsEditorComponent,
    
    CampAdminBasicComponent,
    
    CampsAdminComponent,
    
    EventAdminComponent,
    
    UsersAdminComponent,
    
    AlbumAdminComponent,
    
    AlbumAdminMetadataComponent,
    
    AlbumAdminUploadComponent,
    
    AlbumAdminPhotosComponent,
    
  ]
})
export class AdminModule { }
