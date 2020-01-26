import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN VIEWS */
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
import { FrontendComponent } from './frontend.component';


const routes: Routes = [
  {
    path: '',
    component: FrontendComponent,
    children: [

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
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
