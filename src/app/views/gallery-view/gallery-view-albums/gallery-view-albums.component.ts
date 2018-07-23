import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';


import { DataService } from "../../../services/data.service";

import { Album } from "../../../schema/album";

@Component({
  selector: 'gallery-view-albums',
  templateUrl: './gallery-view-albums.component.html',
  styleUrls: ['./gallery-view-albums.component.css']
})
export class GalleryViewAlbumsComponent implements OnChanges {

  @Input()
  year:number;

  albums:Album[];

  constructor(private dataService:DataService) { }

  ngOnChanges(changes:SimpleChanges) {
    if(changes.year) this.loadAlbums(this.year);
  }

  async loadAlbums(year:number){
    this.albums = await this.dataService.getAlbums({year:year, titlePhoto:1})
  }

}
