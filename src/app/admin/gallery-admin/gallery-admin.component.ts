import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";

import { Album } from "../../schema/album";

@Component({
  selector: 'gallery-admin',
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css']
})
export class GalleryAdminComponent implements OnInit {

  albums:Album[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadAlbums();
  }
  
  loadAlbums():void{
    this.dataService.getAlbums({events:1}).then(albums => this.albums = albums);
  }

}
