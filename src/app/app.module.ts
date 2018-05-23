import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from "./app.errorhandler";

/* SHARED */
import { SharedModule } from "./modules/shared.module";

/* SERVICES */
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
import { EventsTimelineComponent } from './components/events-timeline/events-timeline.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { GroupColorPipe } from './pipes/group-color.pipe';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';

// Directives
import { AppearDirective } from './directives/appear.directive';

/* THIRD PARTY */
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ AboutViewComponent, ContactsViewComponent, EventsViewComponent, NewsViewComponent, CampViewComponent, GalleryViewComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent, AlbumsRecentComponent, PhotoGalleryComponent,
    /* CHILD VIEWS */ GalleryViewYearsComponent, GalleryViewAlbumsComponent, GalleryViewAlbumComponent,
    
    /* PIPES */ GroupColorPipe,
    
    /* DIRECTIVES */ AppearDirective,
    
  ],
  imports: [
    BrowserAnimationsModule,    
    AppRoutingModule,
    
    SharedModule,
    
    CollapseModule.forRoot(),
    ScrollToModule.forRoot()
  ],
  providers: [
    DataService, ToastService, MenuService,
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
