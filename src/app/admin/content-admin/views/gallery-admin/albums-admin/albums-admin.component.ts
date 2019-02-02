import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "app/core/services/data.service";

import { Album } from "app/shared/schema/album";
import { Paginated } from "app/shared/schema/paginated";

@Component({
  selector: 'albums-admin',
  templateUrl: './albums-admin.component.html',
  styleUrls: ['./albums-admin.component.scss']
})
export class AlbumsAdminComponent implements OnInit, OnDestroy{

  year:number = null;
  
  albums:Album[] = [];
  
  page:number = 1;
  pages:number;
  
  statuses:any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  };

  options = {
    search:"",
    page:1,
    sort:"-dateFrom",
    filter:{
      status:undefined,
      year:undefined,
      dateFrom:undefined,
      dateTill:undefined,
    }
  };
  
  openFilter:boolean = false;
  
  loading:boolean = false;

  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.options.filter.year = params.year || undefined;
      this.options.page = params.page || 1;
      this.loadAlbums();
    });
  }
  
  ngOnDestroy(){ 
    this.paramsSubscription.unsubscribe();
  }

  async loadAlbums(){
    
    this.loading = true;
    
    let paginated:Paginated<Album> = await this.dataService.getAlbums(this.options);
    
    this.albums = paginated.docs;
    this.pages = paginated.pages;
    
    this.loading = false;
  }

  getPages(){
    let pages = [];
    for(let i = 1; i <= this.pages; i++) pages.push(i);
    return pages;
  }
  
  getPageLink(page:number){
    let params:any = {page:page};
    if(this.year) params.year = this.year || null;
    return ["./",params];
  }
  
  setSort(field:string){
    let asc = this.options.sort.charAt(0) !== "-";
    let currentField = asc ? this.options.sort : this.options.sort.substring(1);
    
    if(field === currentField) this.options.sort = asc ? "-" + field : field;
    else this.options.sort = field;
    
    this.loadAlbums();
  }

}
