import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Album } from "../../schema/album";
import { Member } from "../../schema/member";

@Component({
  selector: 'album-admin',
  templateUrl: './album-admin.component.html',
  styleUrls: ['./album-admin.component.css']
})
export class AlbumAdminComponent implements OnInit {
  
  album:Album;
  
  category:string;
  
  leaders:Member[] = [];

  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.album && (!this.album || this.album._id !== params.album)) this.loadAlbum(params.album);
      
      this.category = params.cat;

    });
  }
  
  async loadAlbum(albumId:string){
    this.album = await this.dataService.getAlbum(albumId,{photos:1,titlePhoto:1});
  }

}
