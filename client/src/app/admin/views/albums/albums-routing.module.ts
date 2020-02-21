import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsViewComponent } from './albums-view/albums-view.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';
import { AlbumsEditComponent } from './albums-edit/albums-edit.component';
import { AlbumsEditPhotosComponent } from './albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditMetadataComponent } from './albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditUploadComponent } from './albums-edit-upload/albums-edit-upload.component';
import { AlbumsComponent } from './albums.component';

const routes: Routes = [

  {
    path: ':album',
    component: AlbumsComponent,
    children: [
      {
        path: 'upravit', component: AlbumsEditComponent,
        children: [
          { path: 'info', component: AlbumsEditMetadataComponent },
          { path: 'fotky/:photo', component: AlbumsEditPhotosComponent },
          { path: 'fotky', redirectTo: 'fotky/prvni', pathMatch: "full" },
          { path: 'nahrat', component: AlbumsEditUploadComponent },
          { path: '', redirectTo: "info", pathMatch: "full" }
        ]
      },
      { path: '', component: AlbumsViewComponent },
    ]
  },

  { path: '', component: AlbumsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
