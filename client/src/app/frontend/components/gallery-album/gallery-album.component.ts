import { Component, Input } from '@angular/core';

import { Album } from "app/shared/schema/album";

@Component({
  selector: 'gallery-album',
  templateUrl: './gallery-album.component.html',
  styleUrls: ['./gallery-album.component.scss']
})
export class GalleryAlbumComponent {

  @Input() album:Album;
  
  constructor() { }

}
