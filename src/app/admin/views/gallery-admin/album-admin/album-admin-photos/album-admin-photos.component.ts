import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { GalleryPhoto } from "../../../../../components/photo-gallery/photo-gallery.component";

import { Album, Photo } from "../../../../../schema/album";

@Component({
  selector: 'album-admin-photos',
  templateUrl: './album-admin-photos.component.html',
  styleUrls: ['./album-admin-photos.component.scss']
})
export class AlbumAdminPhotosComponent implements OnInit {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
    
  galleryPhotos:GalleryPhoto[] = [];
  
  defaultTags:string[] = [];
  customTags:string[] = [];
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
    this.loadTags();
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.album){
      this.updateCustomTags();
    }
  }
  
  async loadTags(){
    var config = await this.dataService.getConfig();
    this.defaultTags = config.gallery.defaultTags.map(item => item.tag);
    this.updateCustomTags();
  }

  updateCustomTags(){
    this.customTags = [];
    this.album.photos.forEach(photo => {
      photo.tags.forEach(tag => this.addCustomTag(tag));
    });
  }
  
  addCustomTag(tag){
    if(this.defaultTags.indexOf(tag) === -1 && this.customTags.indexOf(tag) === -1) this.customTags.push(tag);
  }
  
  async setTitlePhoto(photo){
    await this.dataService.updateAlbum(this.album._id,{titlePhoto:photo._id});
    this.album.titlePhoto = photo;
    this.toastService.toast("Uloženo.");
  }
  
  async savePhoto(photo){
    await this.dataService.updatePhoto(photo._id,photo);
    this.toastService.toast("Uloženo.");
  }  
  
  async deletePhoto(photo){
    
    if(!window.confirm("Opravdu chcete smazat toho foto")) return;
    
    await this.dataService.deletePhoto(photo._id)
    
    this.toastService.toast("Foto smazáno.");
    
    this.save.emit();
  }
  
  hasTag(photo:Photo,tag:string):boolean{
    return photo.tags.indexOf(tag) !== -1;
  }
  
  async toggleTag(photo:Photo,tag:string){
    
    let i = photo.tags.indexOf(tag);
    if(i === -1) photo.tags.push(tag);
    else photo.tags.splice(i,1);
    
    await this.savePhoto(photo);
  }
  
  async newTag(photo:Photo){
    var tag:string = window.prompt("Zadejte název nového tagu:");
    if(!tag) return;
    
    if(tag.charAt(0) === "#") tag = tag.substring(1);
    
    this.addCustomTag(tag);
    
    await this.toggleTag(photo,tag);
  }  

}
