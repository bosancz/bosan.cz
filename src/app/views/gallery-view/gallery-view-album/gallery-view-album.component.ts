import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";

import { Album } from "../../../schema/album";

@Component({
  selector: 'gallery-view-album',
  templateUrl: './gallery-view-album.component.html',
  styleUrls: ['./gallery-view-album.component.css']
})
export class GalleryViewAlbumComponent implements OnInit {

  album:Album;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.album) this.loadAlbum(params.album);
      else this.album = null;
      
    });
  }
  
    
  loadAlbum(id:string){
    this.dataService.getAlbum(id)
      .then(album => this.album = album);
  }


}
