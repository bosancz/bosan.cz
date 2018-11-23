import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

/* MAIN VIEWS */
import { AboutViewComponent } from 'app/views/about-view/about-view.component';
import { CampViewComponent } from 'app/views/camp-view/camp-view.component';
import { ContactsViewComponent } from 'app/views/contacts-view/contacts-view.component';
import { EventsViewComponent } from 'app/views/events-view/events-view.component';
import { GalleryViewComponent } from 'app/views/gallery-view/gallery-view.component';
import { NewsViewComponent } from 'app/views/news-view/news-view.component';
import { NotFoundComponent } from 'app/views/not-found/not-found.component';

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from 'app/views/gallery-view/gallery-view-album/gallery-view-album.component';
import { GalleryViewTimelineComponent } from 'app/views/gallery-view/gallery-view-timeline/gallery-view-timeline.component';
import { GalleryViewPhotosComponent } from 'app/views/gallery-view/gallery-view-photos/gallery-view-photos.component';

/* SERVICES */

const routes:Routes = [
  {path: 'aktualne', component: NewsViewComponent},

  {path: 'fotogalerie', component: GalleryViewComponent,
   children: [
     {path: ':album/:photo', component: GalleryViewPhotosComponent},
     {path: ':album', component: GalleryViewAlbumComponent},
     {path: '', component: GalleryViewTimelineComponent}
   ]
  },

  {path: 'kontakty', component: ContactsViewComponent},

  {path: 'o-nas', component: AboutViewComponent},

  {path: 'program', component: EventsViewComponent},  

  {path: 'tabor', component: CampViewComponent},  

  {path: 'interni', loadChildren: './admin/admin.module#AdminModule'},
  
  {path: '', redirectTo: "o-nas", pathMatch: "full"},
  
  {path: '**', component: NotFoundComponent}

];

const extraOptions:ExtraOptions = {
  scrollPositionRestoration: "enabled",
  anchorScrolling: "enabled"
};

@NgModule({
  imports: [RouterModule.forRoot(routes, extraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }