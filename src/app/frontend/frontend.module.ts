import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* MODULES */
import { FrontendRoutingModule } from './frontend-routing.module';
import { AppSharedModule } from 'app/shared/app-shared.module';

/* VIEWS */
import { AboutViewComponent } from 'app/frontend/views/about-view/about-view.component';
import { CampViewComponent } from 'app/frontend/views/camp-view/camp-view.component';
import { ContactsViewComponent } from 'app/frontend/views/contacts-view/contacts-view.component';
import { EventsViewComponent } from 'app/frontend/views/events-view/events-view.component';
import { GalleryViewComponent } from 'app/frontend/views/gallery-view/gallery-view.component';
import { NewsViewComponent } from 'app/frontend/views/news-view/news-view.component';

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from 'app/frontend/views/gallery-view/gallery-view-album/gallery-view-album.component';
import { GalleryViewTimelineComponent } from 'app/frontend/views/gallery-view/gallery-view-timeline/gallery-view-timeline.component';
import { GalleryViewPhotosComponent } from 'app/frontend/views/gallery-view/gallery-view-photos/gallery-view-photos.component';

/* COMPONENTS */
import { AlbumsRecentComponent } from './components/albums-recent/albums-recent.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { EventsTimelineComponent } from './components/events-timeline/events-timeline.component';
import { GalleryAlbumComponent } from './components/gallery-album/gallery-album.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { TimelineScrollComponent } from './components/timeline-scroll/timeline-scroll.component';
import { PhotoGalleryComponent } from "./components/photo-gallery/photo-gallery.component";

/* THIRD PARTY */
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [
    /* VIEWS */
    AboutViewComponent,
    ContactsViewComponent,
    EventsViewComponent,
    NewsViewComponent,
    CampViewComponent,
    GalleryViewComponent,

    /* CHILD VIEWS */
    GalleryViewTimelineComponent,
    GalleryViewAlbumComponent,
    GalleryViewPhotosComponent,

    /* COMPONENTS */
    TimelineScrollComponent,
    PhotoGalleryComponent,
    ContactCardComponent,
    GalleryAlbumComponent,
    EventsTimelineComponent,
    GoogleMapComponent,
    AlbumsRecentComponent,
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    AppSharedModule,
    ScrollToModule
  ]
})
export class FrontendModule { }
