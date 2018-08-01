import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';


import { DataService } from "../../../services/data.service";

import { Paginated } from "../../../schema/paginated";
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
  
  pagesLoaded:number = 0;
  pagesTotal:number = 1;

  constructor(private dataService:DataService) { }

  ngOnChanges(changes:SimpleChanges) {
    if(changes.year){
      this.albums = [];
      this.pagesLoaded = 0;
      this.loadAlbums(this.year);
    }
  }

  async loadAlbums(year:number){
    
    this.pagesLoaded++;
    
    var paginated:Paginated<Album> = await this.dataService.getAlbums({year:year, titlePhoto:1, page: this.pagesLoaded})
    
    this.albums.push(...paginated.docs);
    this.pagesTotal = paginated.pages;
  }

}
