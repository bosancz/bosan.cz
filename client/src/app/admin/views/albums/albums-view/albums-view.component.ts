import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/core/services/data.service";
import { ToastService } from "app/core/services/toast.service";

import { Album } from "app/shared/schema/album";
import { Member } from "app/shared/schema/member";

@Component({
  selector: 'albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent implements OnInit, OnDestroy {
  
  album:Album;
  
  category:string;
  
  leaders:Member[] = [];
  
  deleteConfirmation:boolean = false;

  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.album && (!this.album || this.album._id !== params.album)) this.loadAlbum(params.album);
      
      this.category = params.cat;

    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  async loadAlbum(albumId:string){
    this.album = await this.dataService.getAlbum(albumId,{photos:1,titlePhotos:1,event:1});
  }
  
  async deleteAlbum(){
    let name = this.album.name;
    await this.dataService.deleteAlbum(this.album._id);
    this.toastService.toast("Album " + name + " bylo smazáno.");
    this.router.navigate(["../../"],{relativeTo:this.route});
  }

}
