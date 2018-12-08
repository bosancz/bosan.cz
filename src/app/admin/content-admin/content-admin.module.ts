import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/modules/app-shared.module";
import { AdminSharedModule } from "../modules/admin-shared.module";

import { ContentAdminComponent } from './content-admin.component';

import { ContentAdminRoutingModule } from './content-admin-routing.module';

/* VIEWS */
import { CampsAdminComponent } from './views/camps-admin/camps-admin.component';
import { CampAdminComponent } from './views/camps-admin/camp-admin/camp-admin.component';
import { CampAdminDashboardComponent } from './views/camps-admin/camp-admin/camp-admin-dashboard/camp-admin-dashboard.component';
import { CampAdminBasicComponent } from './views/camps-admin/camp-admin/camp-admin-basic/camp-admin-basic.component';

import { EventsAdminComponent } from './views/events-admin/events-admin.component';
import { EventAdminComponent } from './views/events-admin/event-admin/event-admin.component';
import { EventAdminDashboardComponent } from './views/events-admin/event-admin/event-admin-dashboard/event-admin-dashboard.component';
import { EventAdminAttendeesComponent } from './views/events-admin/event-admin/event-admin-attendees/event-admin-attendees.component';
import { EventAdminInfoComponent } from './views/events-admin/event-admin/event-admin-info/event-admin-info.component';
import { EventAdminLeadersComponent } from './views/events-admin/event-admin/event-admin-leaders/event-admin-leaders.component';
import { EventAdminPaymentsComponent } from './views/events-admin/event-admin/event-admin-payments/event-admin-payments.component';
import { EventAdminRegistrationComponent } from './views/events-admin/event-admin/event-admin-registration/event-admin-registration.component';
import { EventAdminRecurringComponent } from './views/events-admin/event-admin/event-admin-recurring/event-admin-recurring.component';

import { GalleryAdminComponent } from './views/gallery-admin/gallery-admin.component';
import { AlbumsAdminComponent } from './views/gallery-admin/albums-admin/albums-admin.component';
import { AlbumAdminDashboardComponent } from './views/gallery-admin/album-admin/album-admin-dashboard/album-admin-dashboard.component';
import { AlbumAdminComponent } from './views/gallery-admin/album-admin/album-admin.component';
import { AlbumAdminMetadataComponent } from './views/gallery-admin/album-admin/album-admin-metadata/album-admin-metadata.component';
import { AlbumAdminUploadComponent } from './views/gallery-admin/album-admin/album-admin-upload/album-admin-upload.component';
import { AlbumAdminPhotosComponent } from './views/gallery-admin/album-admin/album-admin-photos/album-admin-photos.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/members-admin/member-admin/member-admin.component';
import { MemberAdminInfoComponent } from './views/members-admin/member-admin/member-admin-info/member-admin-info.component';
import { MemberAdminAchievementsComponent } from './views/members-admin/member-admin/member-admin-achievements/member-admin-achievements.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';

import { ServerAdminComponent } from './views/server-admin/server-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';
import { UserAdminComponent } from './views/users-admin/user-admin/user-admin.component';


/* COMMON COMPONENTS */

import { ContactsEditorComponent } from './components/contacts-editor/contacts-editor.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { CodelistEditorComponent } from './components/codelist-editor/codelist-editor.component';
import { TypeaheadFieldComponent } from './components/typeahead-field/typeahead-field.component';
import { PhotoTagsEditorComponent } from './components/photo-tags-editor/photo-tags-editor.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { ErrorsAdminComponent } from './views/errors-admin/errors-admin.component';
import { ErrorAdminComponent } from './views/errors-admin/error-admin/error-admin.component';
import { PaymentsAdminComponent } from './views/payments-admin/payments-admin.component';

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
    EventsAdminComponent, EventAdminComponent, EventAdminDashboardComponent, EventAdminAttendeesComponent, EventAdminInfoComponent, EventAdminLeadersComponent, EventAdminRegistrationComponent, EventAdminRecurringComponent, 
    GalleryAdminComponent, AlbumsAdminComponent, AlbumAdminDashboardComponent, AlbumAdminComponent, AlbumAdminMetadataComponent, AlbumAdminUploadComponent, AlbumAdminPhotosComponent,
    MembersAdminComponent, MemberAdminComponent, MemberAdminInfoComponent, MemberAdminAchievementsComponent, 
    WebAdminComponent,
    ServerAdminComponent,
    CampsAdminComponent, CampAdminComponent, CampAdminDashboardComponent, CampAdminBasicComponent,
    UsersAdminComponent, UserAdminComponent,
    
    /* SHARED */
    ContactsEditorComponent, MembersSelectComponent, CodelistEditorComponent, TypeaheadFieldComponent, PhotoTagsEditorComponent, GroupsSelectComponent, EventAdminPaymentsComponent, ErrorsAdminComponent, ErrorAdminComponent, PaymentsAdminComponent
    
  ]
})
export class ContentAdminModule { }
