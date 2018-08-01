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
    let query:any = {limit: 5, sort: "-published", events: 1, titlePhoto: 1};
    
    var paginated = await this.dataService.getAlbums(query);
    
    this.albums = paginated.docs;
    
    // fill the empty places with blank albums
    while(this.albums.length < 5) this.albums.push(new Album());
  }
  
  getAlbumLink(album:Album):string{
    if(!album._id) return "";
    return "/galerie/" + album.year + "/" + album._id;
  }
  
  getEventImageUrl(album:Album):string{
    return "/data/albums/" + album._id + "/" + album.titlePhoto;
  }

}
