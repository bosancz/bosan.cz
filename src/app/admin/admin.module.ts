import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../shared/shared.module";

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

@NgModule({
  imports: [
    CommonModule,
    
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    
    /* VIEWS */ EventsAdminComponent, GalleryAdminComponent, MembersAdminComponent, WebAdminComponent, DataAdminComponent, DocumentsViewComponent, CampAdminComponent,
    
    /* WEB CONFIG */ ConfigDocumentsComponent, ConfigAboutComponent,
    
    ContactsEditorComponent
  ]
})
export class AdminModule { }
