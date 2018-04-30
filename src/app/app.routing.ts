import { Routes, RouterModule } from '@angular/router';

/* MAIN VIEWS */
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

const appRoutes:Routes = [
  
  {path: 'aktualne', component: NewsViewComponent},
  
  {path: 'fotogalerie', component: GalleryViewComponent,
   children: [
     {path: ':year/:album', component: GalleryViewAlbumComponent},
     {path: ':year', component: GalleryViewAlbumsComponent},
     {path: '', component: GalleryViewYearsComponent}
   ]
  },
  
  
  {path: 'kontakty', component: ContactsViewComponent},
  
  {path: 'o-nas', component: AboutViewComponent},
  
  {path: 'program', component: EventsViewComponent},  
  
  {path: 'tabor', component: CampViewComponent},  
  
  
  {path: '', redirectTo: 'aktualne', pathMatch: 'full'},
  
];

export const AppRouting = RouterModule.forRoot(appRoutes);