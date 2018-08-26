import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from "./app.errorhandler";

/* SHARED */
import { SharedModule } from "./modules/shared.module";

/* SERVICES */
import { ACLService } from "./services/acl.service";
import { AuthService } from "./services/auth.service";
import { DataService } from "./services/data.service";
import { ToastService } from "./services/toast.service";
import { MenuService } from "./services/menu.service";

/* VIEWS */
import { AboutViewComponent } from './views/about-view/about-view.component';
import { CampViewComponent } from './views/camp-view/camp-view.component';
import { ContactsViewComponent } from './views/contacts-view/contacts-view.component';
import { EventsViewComponent } from './views/events-view/events-view.component';
import { GalleryViewComponent } from './views/gallery-view/gallery-view.component';
import { NewsViewComponent } from './views/news-view/news-view.component';

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from './views/gallery-view/gallery-view-album/gallery-view-album.component';
import { GalleryViewTimelineComponent } from './views/gallery-view/gallery-view-timeline/gallery-view-timeline.component';
import { GalleryViewPhotosComponent } from './views/gallery-view/gallery-view-photos/gallery-view-photos.component';

/* SHARED */

// Components
import { AlbumsRecentComponent } from './components/albums-recent/albums-recent.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { EventsTimelineComponent } from './components/events-timeline/events-timeline.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TimelineScrollComponent } from './components/timeline-scroll/timeline-scroll.component';

// Directives
import { AppearDirective } from './directives/appear.directive';
import { AdminLinkDirective } from './directives/admin-link.directive';

// Pipes

/* THIRD PARTY */
import { JwtModule } from '@auth0/angular-jwt';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// App Config
import { AppConfig, AppConfigData } from "./config/config";

// settings for JWT
export function JwtTokenGetter():string{
  return localStorage.getItem('id_token') || ""
}

export const jwtOptions = {
	config: {
		tokenGetter: JwtTokenGetter,
		whitelistedDomains: ['bosancz.smallhill.cz'],
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
    
    /* PIPES */
    
    /* DIRECTIVES */ AppearDirective, AdminLinkDirective,
    
    /* COMPONENTS */ ContactCardComponent, LoginFormComponent, TimelineScrollComponent
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
  entryComponents: [ LoginFormComponent ]
})
export class AppModule { }
