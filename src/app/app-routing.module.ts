import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN VIEWS */
import { AboutViewComponent } from './views/about-view/about-view.component';
import { CampViewComponent } from './views/camp-view/camp-view.component';
import { ContactsViewComponent } from './views/contacts-view/contacts-view.component';
import { EventsViewComponent } from './views/events-view/events-view.component';
import { GalleryViewComponent } from './views/gallery-view/gallery-view.component';
import { NewsViewComponent } from './views/news-view/news-view.component';

/* CHILD VIEWS */
import { GalleryViewAlbumComponent } from './views/gallery-view/gallery-view-album/gallery-view-album.component';
import { GalleryViewHomeComponent } from './views/gallery-view/gallery-view-home/gallery-view-home.component';
import { GalleryViewYearComponent } from './views/gallery-view/gallery-view-year/gallery-view-year.component';


/* SERVICES */
import { ACLService } from "./services/acl.service";

const routes: Routes = [
  {path: 'aktualne', component: NewsViewComponent},

  {path: 'fotogalerie', component: GalleryViewComponent,
   children: [
     {path: ':year/:album', component: GalleryViewAlbumComponent},
     {path: ':year', component: GalleryViewYearComponent},
     {path: '', component: GalleryViewHomeComponent}
   ]
  },


  {path: 'kontakty', component: ContactsViewComponent},

  {path: 'o-nas', component: AboutViewComponent},

  {path: 'program', component: EventsViewComponent},  

  {path: 'tabor', component: CampViewComponent},  

  {path: 'interni', loadChildren: './admin/admin.module#AdminModule', canActivate: [ACLService]},
  
  {path: '', redirectTo: "o-nas", pathMatch: "full"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }