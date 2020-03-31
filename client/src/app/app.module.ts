import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* MODULES */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "app/shared/shared.module";

// Locale
import { registerLocaleData, CommonModule } from '@angular/common';
import localeCs from '@angular/common/locales/cs';


// App Config
import { environment } from "environments/environment";

/* ROOT COMPONENT */
import { AppComponent } from './app.component';

/* VIEWS */
import { NotFoundComponent } from './views/not-found/not-found.component';
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

/* COMPONENTS */
import { PageMenuComponent } from './components/page-menu/page-menu.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';

/* THIRD PARTY */
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';


console.log("Angular is running in " + (environment.production ? "production" : "development") + " environment");

registerLocaleData(localeCs, 'cs');

@NgModule({
  declarations: [

    AppComponent,

    /* VIEWS */
    NotFoundComponent,
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
    PageMenuComponent,
    PageFooterComponent,

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,

    ScrollToModule,

    BrowserAnimationsModule,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
