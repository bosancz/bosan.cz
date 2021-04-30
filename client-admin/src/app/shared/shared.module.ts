import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
/* COMPONENTS */
import { ActionButtonsComponent } from "./components/action-buttons/action-buttons.component";
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { PhotoFaceComponent } from './components/photo-face/photo-face.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
/* DIRECTIVES */
import { AclCanDirective } from "./directives/acl-can.directive";
import { TextcheckDirective } from './directives/textcheck.directive';
/* PIPES */
import { AgePipe } from './pipes/age.pipe';
import { DateRangePipe } from "./pipes/date-range.pipe";
import { EventStatusPipe } from './pipes/event-status.pipe';
import { EventPipe } from "./pipes/event.pipe";
import { FormatPhonePipe } from './pipes/format-phone.pipe';
import { GroupPipe } from "./pipes/group.pipe";
import { JoinLeadersPipe } from './pipes/join-leaders.pipe';
import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';







@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonicModule,
  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    EventStatusBadgeComponent,
    ActionButtonsComponent,

    EventCardComponent,
    PhotoFaceComponent,
    EventCalendarComponent,
    PhotoGalleryComponent,

    /* DIRECTIVES */
    TextcheckDirective,
    AclCanDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    PrettyBytesPipe,
    AgePipe,
    EventStatusPipe,

  ],
  exports: [
    FormsModule,
    IonicModule,

    /* COMPONENTS */
    AdminTableComponent,
    GroupsSelectComponent,
    PhotoGalleryComponent,
    ActionButtonsComponent,

    EventCardComponent,
    PhotoFaceComponent,

    EventStatusBadgeComponent,
    EventCalendarComponent,

    /* DIRECTIVES */
    TextcheckDirective,
    AclCanDirective,

    /* PIPES */
    JoinLeadersPipe,
    GroupPipe,
    DateRangePipe,
    EventPipe,
    FormatPhonePipe,
    PrettyBytesPipe,
    AgePipe,
    EventStatusPipe,
  ],
  providers: []

})
export class SharedModule { }
