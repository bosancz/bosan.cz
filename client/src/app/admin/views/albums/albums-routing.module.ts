import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumsViewComponent } from './views/albums-view/albums-view.component';
import { AlbumsListComponent } from './views/albums-list/albums-list.component';

import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsEditPhotoComponent } from './views/albums-edit/albums-edit-photo/albums-edit-photo.component';
import { AlbumsEditPhotosComponent } from './views/albums-edit/albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditMetadataComponent } from './views/albums-edit/albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditUploadComponent } from './views/albums-edit/albums-edit-upload/albums-edit-upload.component';

const routes: Routes = [

  {
    path: ':album/upravit', component: AlbumsEditComponent,
    children: [
      { path: 'info', component: AlbumsEditMetadataComponent },
      { path: 'fotky/:photo', component: AlbumsEditPhotoComponent },
      { path: 'fotky', component: AlbumsEditPhotosComponent },
      { path: 'nahrat', component: AlbumsEditUploadComponent },
      { path: '', redirectTo: "info", pathMatch: "full" }
    ]
  },

  { path: ':album', component: AlbumsViewComponent },

  { path: '', component: AlbumsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
