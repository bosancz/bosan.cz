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
  
  isTitlePhoto(photo){
    return this.album.titlePhotos && this.album.titlePhotos.some(titlePhoto => titlePhoto._id === photo._id);
  }
  
  async setTitlePhoto(photo){
    
    let titlePhotos = this.album.titlePhotos ? this.album.titlePhotos.map(photo => photo._id) : [];
    titlePhotos.push(photo._id);
    
    await this.dataService.updateAlbum(this.album._id,{titlePhotos:titlePhotos});
    
    this.album.titlePhotos.push(photo);
    
    this.toastService.toast("Uloženo.");
  }
  
  async moveTitlePhoto(from:number,to:number){
    
    if(to < 0 || to >= this.album.titlePhotos.length) return;
      
    let titlePhotos = this.album.titlePhotos ? this.album.titlePhotos.map(photo => photo._id) : [];
    titlePhotos.splice(to,0,titlePhotos.splice(from,1)[0]);    
    
    await this.dataService.updateAlbum(this.album._id,{titlePhotos:titlePhotos});
    
    this.album.titlePhotos.splice(to,0,this.album.titlePhotos.splice(from,1)[0]);    
    
    this.toastService.toast("Uloženo.");
  }
  
  async removeTitlePhoto(photo){
    
    if(!this.album.titlePhotos) return;
    
    let titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id).map(photo => photo._id);
    
    await this.dataService.updateAlbum(this.album._id,{titlePhotos:titlePhotos});
    
    this.album.titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id);
    
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
