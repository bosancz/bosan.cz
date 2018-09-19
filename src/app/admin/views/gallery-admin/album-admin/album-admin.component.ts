import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { Album } from "app/schema/album";
import { Member } from "app/schema/member";

@Component({
  selector: 'album-admin',
  templateUrl: './album-admin.component.html',
  styleUrls: ['./album-admin.component.css']
})
export class AlbumAdminComponent implements OnInit, OnDestroy {
  
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
    var name = this.album.name;
    await this.dataService.deleteAlbum(this.album._id)
    this.toastService.toast("Album " + name + " bylo smazáno.");
    this.router.navigate(["/interni/galerie"]);
  }

}
