import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared/modules/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { AlbumsRoutingModule } from './albums-routing.module';
/* SERVICES */
import { AlbumsService } from './albums.service';
/* COMPONENTS */
import { PhotoFaceEditComponent } from './components/photo-face-edit/photo-face-edit.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { PhotoViewComponent } from './components/photo-view/photo-view.component';
import { PhotosUploadComponent } from './components/photos-upload/photos-upload.component';
/* VIEWS */
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';
import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsListComponent } from './views/albums-list/albums-list.component';
import { AlbumsViewInfoComponent } from './views/albums-view/albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './views/albums-view/albums-view-photos/albums-view-photos.component';
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';
import { EventSelectorComponent } from './components/event-selector/event-selector.component';
import { EventSelectorModalComponent } from './components/event-selector-modal/event-selector-modal.component';






@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsCreateComponent,
    AlbumsEditComponent,
    PhotosUploadComponent,
    PhotoFaceEditComponent,
    AlbumsViewComponent,
    PhotoGalleryComponent,
    AlbumsViewInfoComponent,
    AlbumsViewPhotosComponent,
    PhotoViewComponent,
    EventSelectorComponent,
    EventSelectorModalComponent,
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
