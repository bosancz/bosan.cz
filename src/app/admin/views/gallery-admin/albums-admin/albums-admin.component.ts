import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "../../../../services/data.service";

import { Album } from "../../../../schema/album";

@Component({
  selector: 'albums-admin',
  templateUrl: './albums-admin.component.html',
  styleUrls: ['./albums-admin.component.scss']
})
export class AlbumsAdminComponent implements OnInit, OnDestroy{

  @Input() year:number = null;
  
  albums:Album[] = [];

  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.year = params.year;
      this.loadAlbums(params.year);
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadAlbums(year:number){
    this.albums = await this.dataService.getAlbums({events:1,year:year || null});
  }

  getAlbumLink(album:Album):string{
    return './' + album._id;
  }

  openAlbum(album:Album):void{
    this.router.navigate([this.getAlbumLink(album)],{relativeTo:this.route});
  }

}
