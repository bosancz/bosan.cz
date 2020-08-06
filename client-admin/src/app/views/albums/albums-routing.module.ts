import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumsListComponent } from './views/albums-list/albums-list.component';

import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsEditPhotoComponent } from './views/albums-edit/albums-edit-photo/albums-edit-photo.component';
import { AlbumsEditPhotosComponent } from './views/albums-edit/albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditMetadataComponent } from './views/albums-edit/albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditUploadComponent } from './views/albums-edit/albums-edit-upload/albums-edit-upload.component';
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';

const routes: Routes = [

  { path: 'vytvorit', component: AlbumsCreateComponent },

  {
    path: ':album/upravit', component: AlbumsEditComponent,
    children: [
      { path: 'fotky/:photo', component: AlbumsEditPhotoComponent },
      { path: 'fotky', component: AlbumsEditPhotosComponent },
      { path: 'info', component: AlbumsEditMetadataComponent },
      { path: 'nahrat', component: AlbumsEditUploadComponent },
      { path: '', redirectTo: "fotky", pathMatch: "full" }
    ]
  },

  { path: ':album', redirectTo: ":album/upravit", pathMatch: "full" },

  { path: '', component: AlbumsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
