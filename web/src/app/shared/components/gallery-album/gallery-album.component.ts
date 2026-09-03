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

    const titleIds = new Set((this.album.titlePhotos ?? []).slice(0, 1).map((p: Photo) => p._id));
    const pool = (this.album.photos ?? []).filter((p: Photo) => !titleIds.has(p._id));

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, this.previewCount);
  }

}
