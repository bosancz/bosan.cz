import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/shared/app-shared.module";
import { AdminSharedModule } from "app/admin/shared/admin-shared.module";

import { ContentAdminComponent } from './content-admin.component';

import { ContentAdminRoutingModule } from './content-admin-routing.module';

/* VIEWS */
import { EventsAdminComponent } from './views/events-admin/events-admin.component';

import { EventAdminComponent } from './views/event-admin/event-admin.component';
import { EventAdminAttendeesComponent } from './views/event-admin/event-admin-attendees/event-admin-attendees.component';
import { EventAdminInfoComponent } from './views/event-admin/event-admin-info/event-admin-info.component';
import { EventAdminLeadersComponent } from './views/event-admin/event-admin-leaders/event-admin-leaders.component';
import { EventAdminRegistrationComponent } from './views/event-admin/event-admin-registration/event-admin-registration.component';
import { EventAdminRecurringComponent } from './views/event-admin/event-admin-recurring/event-admin-recurring.component';

import { AlbumsAdminComponent } from './views/albums-admin/albums-admin.component';
import { AlbumAdminComponent } from './views/album-admin/album-admin.component';
import { AlbumAdminMetadataComponent } from './views/album-admin/album-admin-metadata/album-admin-metadata.component';
import { AlbumAdminUploadComponent } from './views/album-admin/album-admin-upload/album-admin-upload.component';
import { AlbumAdminPhotosComponent } from './views/album-admin/album-admin-photos/album-admin-photos.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/member-admin/member-admin.component';
import { MemberAdminInfoComponent } from './views/member-admin/member-admin-info/member-admin-info.component';
import { MemberAdminAchievementsComponent } from './views/member-admin/member-admin-achievements/member-admin-achievements.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';
import { UserAdminComponent } from './views/user-admin/user-admin.component';

import { ErrorsAdminComponent } from './views/errors-admin/errors-admin.component';
import { ErrorAdminComponent } from './views/error-admin/error-admin.component';

/* COMMON COMPONENTS */

import { ContactsEditorComponent } from './components/contacts-editor/contacts-editor.component';
import { CodelistEditorComponent } from './components/codelist-editor/codelist-editor.component';
import { TypeaheadFieldComponent } from './components/typeahead-field/typeahead-field.component';
import { PhotoTagsEditorComponent } from './components/photo-tags-editor/photo-tags-editor.component';


@NgModule({
  imports: [
    CommonModule,
    ContentAdminRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ],
  declarations: [
    ContentAdminComponent,
    
    /* VIEWS */
    EventsAdminComponent, EventAdminComponent, EventAdminAttendeesComponent, EventAdminInfoComponent, EventAdminLeadersComponent, EventAdminRegistrationComponent, EventAdminRecurringComponent, 
    AlbumsAdminComponent, AlbumAdminComponent, AlbumAdminMetadataComponent, AlbumAdminUploadComponent, AlbumAdminPhotosComponent,
    MembersAdminComponent, MemberAdminComponent, MemberAdminInfoComponent, MemberAdminAchievementsComponent, 
    WebAdminComponent,

    UsersAdminComponent, UserAdminComponent,
    
    /* SHARED */
    ContactsEditorComponent, CodelistEditorComponent, TypeaheadFieldComponent, PhotoTagsEditorComponent, ErrorsAdminComponent, ErrorAdminComponent 
    
  ]
})
export class ContentAdminModule { }
