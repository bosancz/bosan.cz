import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";

import { Album } from "../../../schema/album";

@Component({
  selector: 'gallery-view-albums',
  templateUrl: './gallery-view-albums.component.html',
  styleUrls: ['./gallery-view-albums.component.css']
})
export class GalleryViewAlbumsComponent implements OnInit {
  
  year:number;
  
  albums:Album[];
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {
    
     this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
       this.year = params.year;
       
       this.loadAlbums(params.year);

    });
    
  }
  loadAlbums(year:number){
   this.dataService.getAlbums({year:year})
      .then(albums => this.albums = albums);
  }

}
