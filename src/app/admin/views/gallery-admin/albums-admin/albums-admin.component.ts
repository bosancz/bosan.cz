import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "../../../../services/data.service";

import { Album } from "../../../../schema/album";
import { Paginated } from "../../../../schema/paginated";

@Component({
  selector: 'albums-admin',
  templateUrl: './albums-admin.component.html',
  styleUrls: ['./albums-admin.component.scss']
})
export class AlbumsAdminComponent implements OnInit, OnDestroy{

  @Input() year:number = null;
  
  albums:Album[] = [];
  
  page:number = 1;
  pages:number;

  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.year = params.year;
      this.page = params.page || 1;
      this.loadAlbums();
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadAlbums(){
    var options = {
      events:1,
      year:this.year || null,
      page:this.page || 1
    };
    let paginated:Paginated<Album> = await this.dataService.getAlbums(options);
    
    this.albums = paginated.docs;
    this.pages = paginated.pages;
  }

  getAlbumLink(album:Album):string{
    return './' + album._id;
  }

  openAlbum(album:Album):void{
    this.router.navigate([this.getAlbumLink(album)],{relativeTo:this.route});
  }
  
  getPages(){
    var pages = [];
    for(var i = 1; i <= this.pages; i++) pages.push(i)
    return pages;
  }
  
  getPageLink(page:number){
    var params:any = {page:page};
    if(this.year) params.year = this.year || null;
    return ["./",params];
  }

}
