import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

/* MODULES */
import { SharedModule } from "app/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";

// Locale
import { CommonModule, registerLocaleData } from "@angular/common";
import localeCs from "@angular/common/locales/cs";

// App Config

/* ROOT COMPONENT */
import { AppComponent } from "./app.component";

/* VIEWS */
import { AboutViewComponent } from "./views/about-view/about-view.component";
import { CampViewComponent } from "./views/camp-view/camp-view.component";
import { ContactsViewComponent } from "./views/contacts-view/contacts-view.component";
import { EventsViewComponent } from "./views/events-view/events-view.component";
import { GalleryViewComponent } from "./views/gallery-view/gallery-view.component";
import { NewsViewComponent } from "./views/news-view/news-view.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from "./views/gallery-view/gallery-view-album/gallery-view-album.component";
import { GalleryViewPhotosComponent } from "./views/gallery-view/gallery-view-photos/gallery-view-photos.component";
import { GalleryViewTimelineComponent } from "./views/gallery-view/gallery-view-timeline/gallery-view-timeline.component";

/* COMPONENTS */
import { PageFooterComponent } from "./components/page-footer/page-footer.component";
import { PageMenuComponent } from "./components/page-menu/page-menu.component";

/* THIRD PARTY */
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { PourFeliciterComponent } from "./components/pour-feliciter/pour-feliciter.component";
import { UkraineHelpComponent } from "./components/ukraine-help/ukraine-help.component";

registerLocaleData(localeCs, "cs");

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
    PourFeliciterComponent,
    UkraineHelpComponent,
  ],
  imports: [CommonModule, AppRoutingModule, SharedModule, ScrollToModule, BrowserAnimationsModule],
  bootstrap: [AppComponent],
  providers: [{ provide: LOCALE_ID, useValue: "cs" }],
})
export class AppModule {}
