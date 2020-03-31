import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { AlbumsRoutingModule } from './albums-routing.module';

/* SERVICES */
import { AlbumsService } from './albums.service';

/* VIEWS */
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';
import { AlbumsListComponent } from './views/albums-list/albums-list.component';
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';

import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsEditMetadataComponent } from './views/albums-edit/albums-edit-metadata/albums-edit-metadata.component';
import { AlbumsEditPhotosComponent } from './views/albums-edit/albums-edit-photos/albums-edit-photos.component';
import { AlbumsEditUploadComponent } from './views/albums-edit/albums-edit-upload/albums-edit-upload.component';

/* COMPONENTS */
import { AlbumsEditPhotoComponent } from './views/albums-edit/albums-edit-photo/albums-edit-photo.component';
import { PhotoFaceEditComponent } from './components/photo-face-edit/photo-face-edit.component';

@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsViewComponent,
    AlbumsCreateComponent,
    
    AlbumsEditComponent,
    AlbumsEditMetadataComponent,
    AlbumsEditPhotosComponent,
    AlbumsEditUploadComponent,
    
    AlbumsEditPhotoComponent,
    PhotoFaceEditComponent,
  ],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    SharedModule
  ],
  providers: [
    AlbumsService
  ]
})
export class AlbumsModule { }
