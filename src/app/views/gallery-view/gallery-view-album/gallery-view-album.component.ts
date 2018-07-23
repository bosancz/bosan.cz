import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";

import { Album } from "../../../schema/album";

import { GalleryPhoto } from "../../../components/photo-gallery/photo-gallery.component";

@Component({
  selector: 'gallery-view-album',
  templateUrl: './gallery-view-album.component.html',
  styleUrls: ['./gallery-view-album.component.css']
})
export class GalleryViewAlbumComponent implements OnInit {

  album:Album;
  
  galleryPhotos:GalleryPhoto[] = [];
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.album) this.loadAlbum(params.album);
      else this.album = null;
      
    });
  }
  
  async loadAlbum(id:string){
    this.album = await this.dataService.getAlbum(id,{photos:1});
    
    this.updateGalleryPhotos()
  }
  
  updateGalleryPhotos(){
    this.galleryPhotos = this.album.photos.map(photo => ({
      url: photo.sizes.small.url,
      width: photo.sizes.small.width,
      height: photo.sizes.small.height,
      caption: photo.caption,
      bg: photo.bg
    }));
  }


}
