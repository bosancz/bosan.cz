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
import { GalleryViewYearsComponent } from './views/gallery-view/gallery-view-years/gallery-view-years.component';
import { GalleryViewAlbumsComponent } from './views/gallery-view/gallery-view-albums/gallery-view-albums.component';
import { GalleryViewAlbumComponent } from './views/gallery-view/gallery-view-album/gallery-view-album.component';

/* SHARED */

// Components
import { AlbumsRecentComponent } from './components/albums-recent/albums-recent.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';
import { EventsTimelineComponent } from './components/events-timeline/events-timeline.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { GroupColorPipe } from './pipes/group-color.pipe';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';

// Directives
import { AppearDirective } from './directives/appear.directive';

/* THIRD PARTY */
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';

import { JwtModule } from '@auth0/angular-jwt';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

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

// App Config
import { AppConfig, AppConfigData } from "./config/config";


@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ AboutViewComponent, ContactsViewComponent, EventsViewComponent, NewsViewComponent, CampViewComponent, GalleryViewComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent, AlbumsRecentComponent, PhotoGalleryComponent,
    /* CHILD VIEWS */ GalleryViewYearsComponent, GalleryViewAlbumsComponent, GalleryViewAlbumComponent,
    
    /* PIPES */ GroupColorPipe,
    
    /* DIRECTIVES */ AppearDirective,
    
    ContactCardComponent,
    
    LoginFormComponent,
    
    
    
  ],
  imports: [
    BrowserAnimationsModule,    
    AppRoutingModule,
    
    SharedModule,
    
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    
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
