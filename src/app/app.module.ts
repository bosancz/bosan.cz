import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

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

/* SHARED */
// Components
import { EventsRecentComponent } from './shared/events-recent/events-recent.component';
import { EventsTimelineComponent } from './shared/events-timeline/events-timeline.component';
import { GoogleMapComponent } from './shared/google-map/google-map.component';
import { GroupColorPipe } from './pipes/group-color.pipe';
import { PhotoGalleryComponent } from './shared/photo-gallery/photo-gallery.component';
import { AppearDirective } from './directives/appear.directive';
import { GalleryViewYearsComponent } from './views/gallery-view/gallery-view-years/gallery-view-years.component';
import { GalleryViewAlbumsComponent } from './views/gallery-view/gallery-view-albums/gallery-view-albums.component';
import { GalleryViewAlbumComponent } from './views/gallery-view/gallery-view-album/gallery-view-album.component';


/* THIRD PARTY */
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ AboutViewComponent, ContactsViewComponent, EventsViewComponent, NewsViewComponent, CampViewComponent, GalleryViewComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent, EventsRecentComponent, PhotoGalleryComponent,
    /* CHILD VIEWS */ GalleryViewYearsComponent, GalleryViewAlbumsComponent, GalleryViewAlbumComponent,
    
    /* PIPES */ GroupColorPipe,
    
    /* DIRECTIVES */ AppearDirective,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouting,
    
    ScrollToModule.forRoot()
  ],
  providers: [ DataService, ToastService, MenuService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
