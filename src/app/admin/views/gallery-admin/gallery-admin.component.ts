import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { DataService } from "../../../services/data.service";

import { Album } from "../../../schema/album";

@Component({
  selector: 'gallery-admin',
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css']
})
export class GalleryAdminComponent implements OnInit {

  albums:Album[] = [];
  
  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadAlbums();
  }
  
  loadAlbums():void{
    this.dataService.getAlbums({events:1}).then(albums => this.albums = albums);
  }
  
  getAlbumLink(album:Album):string{
   return './' + album._id;
  }
  
  openAlbum(album:Album):void{
    this.router.navigate([this.getAlbumLink(album)],{relativeTo:this.route});
  }

}
