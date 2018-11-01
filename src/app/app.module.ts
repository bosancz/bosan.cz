import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from 'app/app.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppErrorHandler } from "app/app.errorhandler";

/* SHARED */
import { SharedModule } from "app/modules/shared.module";

/* SERVICES */
import { ACLService } from "app/services/acl.service";
import { AuthService } from "app/services/auth.service";
import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";
import { MenuService } from "app/services/menu.service";

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

// Directives
import { AdminLinkDirective } from 'app/directives/admin-link.directive';

// Pipes
import { FormatPhonePipe } from 'app/pipes/format-phone.pipe';

/* THIRD PARTY */
import { JwtModule } from '@auth0/angular-jwt';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// App Config
import { AppConfig, AppConfigData } from "config/config";
import { SharingModalComponent } from './components/sharing-modal/sharing-modal.component';
import { ShareUrlDirective } from './directives/share-url.directive';

import { environment } from "environments/environment";
import { NotFoundComponent } from './views/not-found/not-found.component';

// settings for JWT
export function JwtTokenGetter():string{
  return localStorage.getItem('id_token') || "";
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
    /* VIEWS */ AboutViewComponent, ContactsViewComponent, EventsViewComponent, NewsViewComponent, CampViewComponent, GalleryViewComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent, AlbumsRecentComponent,
    /* CHILD VIEWS */ GalleryViewTimelineComponent, GalleryViewAlbumComponent, GalleryViewPhotosComponent,

    /* PIPES */ FormatPhonePipe, 

    /* DIRECTIVES */ AdminLinkDirective,

    /* COMPONENTS */ ContactCardComponent, LoginFormComponent, TimelineScrollComponent, GalleryAlbumComponent, SharingModalComponent, ShareUrlDirective, NotFoundComponent
  ],
  imports: [
    BrowserAnimationsModule,    
    AppRoutingModule,

    SharedModule,

    ScrollToModule.forRoot(),

    JwtModule.forRoot(jwtOptions)
  ],
  providers: [
    /* Services */ ACLService, AuthService, DataService, ToastService, MenuService,
    /* Error Handlers */ { provide: ErrorHandler, useClass: AppErrorHandler },
    /* Config Providers */ { provide: AppConfig, useValue: AppConfigData }
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ LoginFormComponent, SharingModalComponent ]
})
export class AppModule { }
