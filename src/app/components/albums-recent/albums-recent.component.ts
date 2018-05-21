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
    
    let query:any = {limit: 5, sort: "-published", events: 1};
    
    this.dataService.getAlbums(query) 
      .then(albums => {
        // fill the empty places with blank albums
        while(albums.length < 5) albums.push(new Album());
        this.albums = albums
      });
  }
  
  getAlbumLink(album:Album):string{
    if(!album._id) return "";
    return "/fotogalerie/" + album.year + "/" + album._id;
  }
  
  getEventImageUrl(album:Album):string{
    return "/data/albums/" + album._id + "/" + album.titlePhoto;
  }

}
