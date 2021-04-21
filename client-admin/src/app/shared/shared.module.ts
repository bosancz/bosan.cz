import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
/* COMPONENTS */
import { ActionButtonsComponent } from "./components/action-buttons/action-buttons.component";
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { CodelistEditorComponent } from "./components/codelist-editor/codelist-editor.component";
import { ContactsEditorComponent } from "./components/contacts-editor/contacts-editor.component";
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { ListSliderComponent } from './components/list-slider/list-slider.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageComponent } from './components/page/page.component';
import { PhotoFaceComponent } from './components/photo-face/photo-face.component';
import { PhotoTagsEditorComponent } from "./components/photo-tags-editor/photo-tags-editor.component";
import { TypeaheadFieldComponent } from "./components/typeahead-field/typeahead-field.component";
/* DIRECTIVES */
import { AclCanDirective } from "./directives/acl-can.directive";
import { ActionMenuDirective } from './directives/action-menu.directive';
import { MenuButtonDirective } from './directives/menu-button.directive';
import { PageTitleDirective } from './directives/page-title.directive';
import { SecondaryMenuDirective } from './directives/secondary-menu.directive';
import { TextcheckDirective } from './directives/textcheck.directive';
/* MODULES */
import { MaterialModule } from './modules/material.module';
/* PIPES */
import { DateRangePipe } from "./pipes/date-range.pipe";
import { EventPipe } from "./pipes/event.pipe";
import { FormatPhonePipe } from './pipes/format-phone.pipe';
import { GroupPipe } from "./pipes/group.pipe";
import { JoinLeadersPipe } from './pipes/join-leaders.pipe';
import { SafeurlPipe } from "./pipes/safeurl.pipe";
import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';







@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    IonicModule,
  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,
    ActionButtonsComponent,

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent,
    EventCardComponent,
    PageHeaderComponent,
    PageComponent,
    PhotoFaceComponent,
    EventCalendarComponent,

    /* DIRECTIVES */
    ActionMenuDirective,
    PageTitleDirective,
    MenuButtonDirective,
    TextcheckDirective,
    SecondaryMenuDirective,
    AclCanDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    SafeurlPipe,
    PrettyBytesPipe,

  ],
  exports: [
    FormsModule,
    IonicModule,

    /* COMPONENTS */
    PageComponent,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    ActionButtonsComponent,

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
    SecondaryMenuDirective,
    AclCanDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    SafeurlPipe,
    PrettyBytesPipe
  ],
  providers: []

})
export class SharedModule { }
