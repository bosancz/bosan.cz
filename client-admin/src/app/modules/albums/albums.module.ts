import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { AlbumsRoutingModule } from './albums-routing.module';

/* SERVICES */
import { AlbumsService } from './albums.service';

/* VIEWS */
import { AlbumsListComponent } from './views/albums-list/albums-list.component';
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';

import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsEditMetadataComponent } from './views/albums-edit/albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditPhotosComponent } from './views/albums-edit/albums-edit-photos/albums-edit-photos.component';

/* COMPONENTS */
import { PhotosUploadComponent } from './components/photos-upload/photos-upload.component';
import { AlbumsEditPhotoComponent } from './views/albums-edit/albums-edit-photo/albums-edit-photo.component';
import { PhotoFaceEditComponent } from './components/photo-face-edit/photo-face-edit.component';
import { MaterialModule } from 'app/shared/modules/material.module';
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { AlbumsViewInfoComponent } from './views/albums-view/albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './views/albums-view/albums-view-photos/albums-view-photos.component';
import { PhotoViewComponent } from './components/photo-view/photo-view.component';

@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsCreateComponent,

    AlbumsEditComponent,
    AlbumsEditMetadataComponent,
    AlbumsEditPhotosComponent,
    PhotosUploadComponent,

    AlbumsEditPhotoComponent,
    PhotoFaceEditComponent,
    AlbumsViewComponent,
    PhotoGalleryComponent,
    AlbumsViewInfoComponent,
    AlbumsViewPhotosComponent,
    PhotoViewComponent,
  ],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    AlbumsService
  ]
})
export class AlbumsModule { }
