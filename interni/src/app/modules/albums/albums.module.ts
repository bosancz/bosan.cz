import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AlbumsRoutingModule } from './albums-routing.module';
/* SERVICES */
import { AlbumsService } from './services/albums.service';
/* COMPONENTS */
import { EventSelectorModalComponent } from './components/event-selector-modal/event-selector-modal.component';
import { EventSelectorComponent } from './components/event-selector/event-selector.component';
import { PhotoViewComponent } from './components/photo-view/photo-view.component';
import { PhotosUploadComponent } from './components/photos-upload/photos-upload.component';
/* VIEWS */
import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsListComponent } from './views/albums-list/albums-list.component';
import { AlbumsViewInfoComponent } from './views/albums-view/albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './views/albums-view/albums-view-photos/albums-view-photos.component';
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';


@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsEditComponent,
    PhotosUploadComponent,
    AlbumsViewComponent,
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
  ],
  providers: [
    AlbumsService
  ]
})
export class AlbumsModule { }
