import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from "@angular/router";

import { MenuService } from "../../services/menu.service";
import { TitleService } from "../../services/title.service";
import { DataService } from "../../services/data.service";

import { Photo } from "../../schema/photo";
import { GalleryPhoto } from "../../components/photo-gallery/photo-gallery.component";

class GalleryPhotoContainer implements GalleryPhoto{
  
  photo: Photo;
  
  // GalleryPhoto
  url: string;
  width: number;
  height: number;
  caption: string;
  bg: string;
}

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.scss']
})
export class CampViewComponent implements OnInit, OnDestroy {

  photos:GalleryPhoto[] = [];
  
  constructor(private menuService:MenuService, private titleService:TitleService, private dataService:DataService, private router:Router) {
    this.menuService.transparent = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Tábor");
    
    this.loadAlbum();
  }

  ngOnDestroy(){
    this.menuService.transparent = false;
  }

  async loadAlbum(){
    
    let config = await this.dataService.getConfig();
    
    let album = await this.dataService.getAlbum(config.camp.album,{photos:1});

    album.photos.sort((a,b) => a.name.localeCompare(b.name));

    this.photos = album.photos.map(photo => ({
      photo: photo,
      url: photo.sizes.small.url,
      width: photo.sizes.small.width,
      height: photo.sizes.small.height,
      //caption: photo.caption,
      bg: photo.bg
    }));
  }
  
  openPhoto(container:GalleryPhotoContainer){
    this.router.navigate(['/fotogalerie/' + container.photo.album + "/" + container.photo._id]);
  }

}
