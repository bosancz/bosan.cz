import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumsRoutingModule } from './albums-routing.module';

import { AlbumsViewComponent } from './albums-view/albums-view.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';

import { AlbumsEditMetadataComponent } from './albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditPhotosComponent } from './albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditUploadComponent } from './albums-edit-upload/albums-edit-upload.component';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';
import { AlbumsEditComponent } from './albums-edit/albums-edit.component';
import { AlbumsService } from './albums.service';
import { AlbumsComponent } from './albums.component';
import { AlbumsEditPhotoComponent } from './albums-edit-photo/albums-edit-photo.component';
import { PhotoFaceEditComponent } from './albums-edit-photo/photo-face-edit/photo-face-edit.component';
import { AlbumsCreateComponent } from './albums-create/albums-create.component';

@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsViewComponent,

    AlbumsEditMetadataComponent,
    AlbumsEditPhotosComponent,
    AlbumsEditUploadComponent,
    AlbumsEditComponent,
    AlbumsComponent,
    AlbumsEditPhotoComponent,
    PhotoFaceEditComponent,
    AlbumsCreateComponent,
  ],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    AdminSharedModule
  ],
  providers: [
    AlbumsService
  ]
})
export class AlbumsModule { }
