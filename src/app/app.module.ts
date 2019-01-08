import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from 'app/app.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppErrorHandler } from "app/app.errorhandler";

import { ServiceWorkerModule } from '@angular/service-worker';

/* SHARED */
import { AppSharedModule } from "app/modules/app-shared.module";

/* VIEWS */
import { AboutViewComponent } from 'app/views/about-view/about-view.component';
import { CampViewComponent } from 'app/views/camp-view/camp-view.component';
import { ContactsViewComponent } from 'app/views/contacts-view/contacts-view.component';
import { EventsViewComponent } from 'app/views/events-view/events-view.component';
import { GalleryViewComponent } from 'app/views/gallery-view/gallery-view.component';
import { NewsViewComponent } from 'app/views/news-view/news-view.component';

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from 'app/views/gallery-view/gallery-view-album/gallery-view-album.component';
import { GalleryViewTimelineComponent } from 'app/views/gallery-view/gallery-view-timeline/gallery-view-timeline.component';
import { GalleryViewPhotosComponent } from 'app/views/gallery-view/gallery-view-photos/gallery-view-photos.component';

/* SHARED */

// Components
import { AlbumsRecentComponent } from 'app/components/albums-recent/albums-recent.component';
import { ContactCardComponent } from 'app/components/contact-card/contact-card.component';
import { EventsTimelineComponent } from 'app/components/events-timeline/events-timeline.component';
import { GalleryAlbumComponent } from 'app/components/gallery-album/gallery-album.component';
import { GoogleMapComponent } from 'app/components/google-map/google-map.component';
import { LoginFormComponent } from 'app/components/login-form/login-form.component';
import { TimelineScrollComponent } from 'app/components/timeline-scroll/timeline-scroll.component';
import { PhotoGalleryComponent } from "app/components/photo-gallery/photo-gallery.component";

import { NotFoundComponent } from './views/not-found/not-found.component';

import { PageMenuComponent } from './components/page-menu/page-menu.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { SharingModalComponent } from './components/sharing-modal/sharing-modal.component';
import { ShareUrlDirective } from './directives/share-url.directive';

// Directives
import { AdminLinkDirective } from 'app/directives/admin-link.directive';

// Pipes
import { FormatPhonePipe } from 'app/pipes/format-phone.pipe';

/* THIRD PARTY */
import { JwtModule } from '@auth0/angular-jwt';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// App Config
import { environment } from "environments/environment";

console.log("Angular is running in " + (environment.production ? "production" : "development") + " environment");

// settings for JWT
export function JwtTokenGetter():string{
  return localStorage.getItem('access_token') || "";
}

export const jwtOptions = {
  config: {
    tokenGetter: JwtTokenGetter,
    whitelistedDomains: environment.jwtDomains,
    throwNoTokenError: false,
    skipWhenExpired: true
  }
};

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ AboutViewComponent, ContactsViewComponent, EventsViewComponent, NewsViewComponent, CampViewComponent, GalleryViewComponent, NotFoundComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent, AlbumsRecentComponent,
    /* CHILD VIEWS */ GalleryViewTimelineComponent, GalleryViewAlbumComponent, GalleryViewPhotosComponent,

    /* PIPES */ FormatPhonePipe, 

    /* DIRECTIVES */ AdminLinkDirective,

    /* COMPONENTS */ ContactCardComponent, LoginFormComponent, TimelineScrollComponent, GalleryAlbumComponent, SharingModalComponent, ShareUrlDirective, PhotoGalleryComponent, PageMenuComponent, PageFooterComponent
  ],
  imports: [
    BrowserAnimationsModule,    
    AppRoutingModule,

    AppSharedModule,

    ScrollToModule.forRoot(),
    JwtModule.forRoot(jwtOptions),
    
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    /* Error Handlers */ { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ LoginFormComponent, SharingModalComponent ]
})
export class AppModule { }
