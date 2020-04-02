import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

/* MODULES */
import { MaterialModule } from './material/material.module';

/* DIRECTIVES */
import { ActionMenuDirective } from './directives/action-menu.directive';
import { PageTitleDirective } from './directives/page-title.directive';
import { MenuButtonDirective } from './directives/menu-button.directive';
import { TextcheckDirective } from './directives/textcheck.directive';

/* COMPONENTS */
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { ListSliderComponent } from './components/list-slider/list-slider.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { CodelistEditorComponent } from "./components/codelist-editor/codelist-editor.component";
import { ContactsEditorComponent } from "./components/contacts-editor/contacts-editor.component";
import { PhotoTagsEditorComponent } from "./components/photo-tags-editor/photo-tags-editor.component";
import { TypeaheadFieldComponent } from "./components/typeahead-field/typeahead-field.component";
import { EventCardComponent } from './components/event-card/event-card.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PhotoFaceComponent } from './components/photo-face/photo-face.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';

/* PIPES */
import { JoinLeadersPipe } from './pipes/join-leaders.pipe';
import { GroupPipe } from "./pipes/group.pipe";
import { DateRangePipe } from "./pipes/date-range.pipe";
import { EventPipe } from "./pipes/event.pipe";
import { FormatPhonePipe } from './pipes/format-phone.pipe';
import { SafeurlPipe } from "./pipes/safeurl.pipe";
import { AclModule } from 'lib/acl';
import { SecondaryMenuComponent } from './components/secondary-menu/secondary-menu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,    
    RouterModule,
    MaterialModule,
    HttpClientModule,

    AclModule,
  ],
  declarations: [
    SecondaryMenuComponent,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent,
    EventCardComponent,
    PageHeaderComponent,
    PhotoFaceComponent,
    EventCalendarComponent,

    /* DIRECTIVES */
    ActionMenuDirective,
    PageTitleDirective,
    MenuButtonDirective,
    TextcheckDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    SafeurlPipe,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule,

    AclModule,

    /* COMPONENTS */
    SecondaryMenuComponent,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent,
    EventCardComponent,
    PageHeaderComponent,
    PhotoFaceComponent,

    EventStatusBadgeComponent,
    EventCalendarComponent,

    /* DIRECTIVES */
    ActionMenuDirective,
    PageTitleDirective,
    MenuButtonDirective,
    TextcheckDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    SafeurlPipe,
  ],
  providers: []

})
export class SharedModule { }
