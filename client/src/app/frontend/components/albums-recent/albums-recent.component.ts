import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/core/services/api.service";
import { Album } from "app/shared/schema/album";

@Component({
  selector: 'albums-recent',
  templateUrl: './albums-recent.component.html',
  styleUrls: ['./albums-recent.component.css']
})
export class AlbumsRecentComponent implements OnInit {

  albums:Album[] = [];
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadAlbums();
  }
  
  async loadAlbums(){
    this.albums = await this.api.get<Album[]>("gallery:recent",{limit:3});
  }

}
