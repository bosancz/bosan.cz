import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {trigger,state,style,animate,transition} from '@angular/animations';

import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";

import { Album, Photo } from "../../../schema/album";

@Component({
  selector: 'gallery-view-photos',
  templateUrl: './gallery-view-photos.component.html',
  styleUrls: ['./gallery-view-photos.component.scss'],
  animations: [
    trigger('photoSwitch', [
      transition(':leave', [
        animate('250ms',style({opacity:0})),
        style({display:"none"})
      ]),
      transition(':enter', style({opacity:1,display:"block"}))
    ]),
    trigger('controlsHide', [
      state("visible", style({opacity:1})),
      state("hidden", style({opacity:0})),
      transition('visible => hidden', animate('250ms')),
      transition('hidden => visible', animate('250ms'))
    ])
]
})
export class GalleryViewPhotosComponent implements OnInit, AfterViewInit, OnDestroy {

  album:Album;
  
  currentId:string;
  
  previousPhoto:Photo;
  currentPhoto:Photo;
  
  currentI:number;
  
  transition:boolean = false;
  
  controlsState:string = "visible";
  
  controlsTimeout:number;
  
  preloading:HTMLImageElement[] = [];
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {  
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!this.album || params.album !== this.album._id) this.loadAlbum(params.album);
      
      this.currentId = params.photo;
      
      if(!this.currentPhoto || params.photo !== this.currentPhoto._id) this.updatePhoto(this.currentId);
      
    });
  }
  
  ngAfterViewInit(){
    this.showControls();
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event:KeyboardEvent){
    switch(event.code){
      case "ArrowLeft": return this.openPreviousPhoto();
      case "ArrowRight": return this.openNextPhoto();
      case "Escape": return this.close();
    }
  }
  
  @HostListener('window:mousemove', [])
  onMouseMove(){
    this.showControls();
  }
  
  async loadAlbum(id:string){
    this.album = await this.dataService.getAlbum(id,{photos:1});
    
    //if(this.album.photos) this.album.photos.sort((a,b) => a.name.localeCompare(b.name));
    //if(this.album.photos) this.album.photos.sort((a,b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
    
    this.updatePhoto(this.currentId);
  }
  
  findPhotoById(photoId:string){
    let index;
    
    this.album.photos.some((photo,i) => {
      if(photo._id === photoId){
        index = i;
        return true;
      }
      return false;
    });
    
    return index;
  }
  
  updatePhoto(photoId:string){
    if(!this.album) return;
    
    this.showControls();
    
    this.previousPhoto = this.currentPhoto;
    this.transition = true;
    
    this.currentI = this.findPhotoById(photoId);
    this.currentPhoto = this.album.photos[this.currentI];
    
    setTimeout(() => this.transition = false,0);
    
    this.preloadPhotos();
  }
  
  preloadPhotos(){
    if(this.currentI + 1 < this.album.photos.length) this.preloadPhoto(this.currentI + 1);
    if(this.currentI - 1 >= 0) this.preloadPhoto(this.currentI - 1);
  }
      
  preloadPhoto(i:number){
    let image = new Image();
    image.src = this.album.photos[i].sizes.big.url;
    this.preloading.shift();
    this.preloading.push(image);
  }

  openPhoto(photo:Photo):void{
    this.router.navigate(["../" + photo._id],{relativeTo:this.route,replaceUrl:true});
  }
  
  openNextPhoto():void{
    if(this.currentI >= this.album.photos.length - 1) return;
    this.openPhoto(this.album.photos[this.currentI + 1]);
  }
  
  openPreviousPhoto(){
    if(this.currentI <= 0) return;
    this.openPhoto(this.album.photos[this.currentI - 1]);
  }
  
  close(){
    this.router.navigate(["../"],{relativeTo:this.route});
  }
  
  showControls(){
    this.controlsState = "visible";
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => this.controlsState = "hidden",3000);
  }
}

  