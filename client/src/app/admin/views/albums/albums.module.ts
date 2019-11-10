import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumsRoutingModule } from './albums-routing.module';

import { AlbumsViewComponent } from './albums-view/albums-view.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';

import { AlbumsViewMetadataComponent } from './albums-view/albums-view-metadata/albums-view-metadata.component';
import { AlbumsViewPhotosComponent } from './albums-view/albums-view-photos/albums-view-photos.component';
import { AlbumsViewUploadComponent } from './albums-view/albums-view-upload/albums-view-upload.component';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

@NgModule({
  declarations: [
    AlbumsListComponent,
    AlbumsViewComponent,

    AlbumsViewMetadataComponent,
    AlbumsViewPhotosComponent,
    AlbumsViewUploadComponent
  ],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    AdminSharedModule
  ]
})
export class AlbumsModule { }
