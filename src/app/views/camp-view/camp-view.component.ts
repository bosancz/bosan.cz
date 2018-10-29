import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from "@angular/router";

import { ConfigService } from "app/services/config.service";
import { MenuService } from "app/services/menu.service";
import { TitleService } from "app/services/title.service";

import { Photo } from "app/schema/photo";
import { GalleryPhoto } from "app/components/photo-gallery/photo-gallery.component";

class GalleryPhotoContainer implements GalleryPhoto{
  
  photo:Photo;
  
  // GalleryPhoto
  url:string;
  width:number;
  height:number;
  caption:string;
  bg:string;
}

@Component({
  selector: 'camp-view',
  templateUrl: './camp-view.component.html',
  styleUrls: ['./camp-view.component.scss']
})
export class CampViewComponent implements OnInit, OnDestroy {

  photos:GalleryPhoto[] = [];
  
  mapUrl:string;
  
  constructor(private menuService:MenuService, private titleService:TitleService, private configService:ConfigService, private router:Router) {
    this.menuService.transparent = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Tábor");
    
    this.loadMapUrl();
  }

  ngOnDestroy(){
    this.menuService.transparent = false;
  }
  
  loadMapUrl(){
    this.configService.getConfig().then(config => {
      this.mapUrl = config.general.campMapUrl;
    });
  }
  
  openPhoto(container:GalleryPhotoContainer){
    this.router.navigate(['/fotogalerie/' + container.photo.album + "/" + container.photo._id]);
  }

}
