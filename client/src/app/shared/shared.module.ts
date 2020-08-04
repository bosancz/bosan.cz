import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

/* PIPES */
import { JoinLeadersPipe } from './pipes/join-leaders.pipe';
import { GroupPipe } from "./pipes/group.pipe";
import { DateRangePipe } from "./pipes/date-range.pipe";
import { EventPipe } from "./pipes/event.pipe";
import { FormatPhonePipe } from './pipes/format-phone.pipe';
import { SafeurlPipe } from "./pipes/safeurl.pipe";

/* COMPONENTS */
import { SharingModalComponent } from './modals/sharing-modal/sharing-modal.component';
import { ShareUrlDirective } from './directives/share-url.directive';

import { AlbumsRecentComponent } from './components/albums-recent/albums-recent.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { EventsTimelineComponent } from './components/events-timeline/events-timeline.component';
import { GalleryAlbumComponent } from './components/gallery-album/gallery-album.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { TimelineScrollComponent, TimelineScrollLabelDirective } from './components/timeline-scroll/timeline-scroll.component';
import { PhotoGalleryComponent } from "./components/photo-gallery/photo-gallery.component";

/* DIRECTIVES */
import { AdminLinkDirective } from 'app/shared/directives/admin-link.directive';

/* THIRD PARTY */
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ShareModule } from 'ngx-sharebuttons';
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    container: 'body'
  });
}


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,

    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),

    ScrollToModule.forRoot(),

    ShareModule

  ],
  declarations: [
    /* COMPONENTS */
    SharingModalComponent,
    TimelineScrollComponent, TimelineScrollLabelDirective,
    PhotoGalleryComponent,
    ContactCardComponent,
    GalleryAlbumComponent,
    EventsTimelineComponent,
    GoogleMapComponent,
    AlbumsRecentComponent,

    /* DIRECTIVES */
    ShareUrlDirective,
    AdminLinkDirective,

    /* PIPES */
    SafeurlPipe,
    GroupPipe,
    DateRangePipe,
    JoinLeadersPipe,
    EventPipe,
    FormatPhonePipe,
  ],
  exports: [
    /* MODULES */
    CommonModule,
    HttpClientModule,
    FormsModule,

    /* BOOTSTRAP */
    CollapseModule,
    ModalModule,
    TooltipModule,
    BsDropdownModule,
    ShareModule,

    /* COMPONENTS */
    SharingModalComponent,
    TimelineScrollComponent, TimelineScrollLabelDirective,
    PhotoGalleryComponent,
    ContactCardComponent,
    GalleryAlbumComponent,
    EventsTimelineComponent,
    GoogleMapComponent,
    AlbumsRecentComponent,

    /* DIRECTIVES */
    ShareUrlDirective,
    AdminLinkDirective,

    /* PIPES */
    SafeurlPipe,
    GroupPipe,
    DateRangePipe,
    JoinLeadersPipe,
    EventPipe,
    FormatPhonePipe,
  ],
  providers: [
    { provide: TooltipConfig, useFactory: getTooltipConfig }
  ]

})
export class SharedModule { }
