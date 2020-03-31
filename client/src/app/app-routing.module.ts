import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* ROOT VIEW */
import { AppComponent } from './app.component';

/* MAIN VIEWS */
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


const routes: Routes = [

  { path: 'aktualne', component: NewsViewComponent },

  {
    path: 'fotogalerie', component: GalleryViewComponent,
    children: [
      { path: ':album/:photo', component: GalleryViewPhotosComponent },
      { path: ':album', component: GalleryViewAlbumComponent },
      { path: '', component: GalleryViewTimelineComponent }
    ]
  },

  { path: 'kontakty', component: ContactsViewComponent },

  { path: 'o-nas', component: AboutViewComponent },

  { path: 'program', component: EventsViewComponent },

  { path: 'tabor', component: CampViewComponent },

  { path: '', redirectTo: "o-nas", pathMatch: "full" }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
