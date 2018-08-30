import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { Album } from "../../schema/album";

@Component({
  selector: 'albums-recent',
  templateUrl: './albums-recent.component.html',
  styleUrls: ['./albums-recent.component.css']
})
export class AlbumsRecentComponent implements OnInit {

  albums:Album[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadAlbums();
  }
  
  async loadAlbums(){
    this.albums = await this.dataService.getAlbumsRecent({limit:3});
    
    for(var album of this.albums){
      if(!album.titlePhotos) album.titlePhotos = [];

      if(album.titlePhotos.length < 3){
        album.titlePhotos.push(...await this.dataService.getAlbumPhotos(album._id,{limit: 3 - album.titlePhotos.length}));
      }
    }
  }

}
