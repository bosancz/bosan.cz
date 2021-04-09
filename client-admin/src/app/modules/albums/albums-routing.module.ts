import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumsListComponent } from './views/albums-list/albums-list.component';

import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsEditPhotoComponent } from './views/albums-edit/albums-edit-photo/albums-edit-photo.component';
import { AlbumsEditPhotosComponent } from './views/albums-edit/albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditMetadataComponent } from './views/albums-edit/albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditUploadComponent } from './views/albums-edit/albums-edit-upload/albums-edit-upload.component';
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';
import { AlbumsViewInfoComponent } from './views/albums-view/albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './views/albums-view/albums-view-photos/albums-view-photos.component';

const routes: Routes = [

  { path: 'vytvorit', component: AlbumsCreateComponent },

  { path: ':album/upravit', component: AlbumsEditComponent, },

  {
    path: ':album',
    component: AlbumsViewComponent,
    children: [
      { path: "info", component: AlbumsViewInfoComponent },
      { path: "fotky", component: AlbumsViewPhotosComponent },
      { path: "", pathMatch: "full", redirectTo: "info" }
    ]
  },

  { path: '', component: AlbumsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
