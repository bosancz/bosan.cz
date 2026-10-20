import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Album } from "app/shared/schema/album";
import { Photo } from "app/shared/schema/photo";

@Component({
  selector: 'gallery-album',
  templateUrl: './gallery-album.component.html',
  styleUrls: ['./gallery-album.component.scss']
})
export class GalleryAlbumComponent implements OnChanges {

  @Input() album: Album;

  @Input() photoCount: number = 3;

  @Input() previewCount: number = 0;

  previewPhotos: Photo[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.album || changes.previewCount) {
      this.previewPhotos = this.pickPreviewPhotos();
    }
  }

  private pickPreviewPhotos(): Photo[] {
    if (!this.album || !this.previewCount) return [];

    return (this.album.previewPhotos ?? []).slice(0, this.previewCount);
  }

}
