import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { DataService } from "app/core/services/data.service";
import { ToastService } from "app/admin/services/toast.service";

import { Album, Photo } from "app/shared/schema/album";

@Component({
  selector: 'albums-view-photos',
  templateUrl: './albums-view-photos.component.html',
  styleUrls: ['./albums-view-photos.component.scss']
})
export class AlbumsViewPhotosComponent implements OnChanges{

  @Input() album:Album;
  
  @Output() saved:EventEmitter<void> = new EventEmitter();
  
  tags:string[] = [];
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnChanges(changes:SimpleChanges){
    if(changes.album) this.updateTags();
  }

  updateTags(){
    this.tags = [];
    this.album.photos.forEach(photo => {
      photo.tags.filter(tag => this.tags.indexOf(tag) === -1).forEach(tag => this.tags.push(tag));
    });
  }
  
  isTitlePhoto(photo){
    return this.album.titlePhotos && this.album.titlePhotos.some(titlePhoto => titlePhoto._id === photo._id);
  }
  
  async setTitlePhoto(photo){
    
    let titlePhotos = this.album.titlePhotos ? this.album.titlePhotos.map(item => item._id) : [];
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
    
    this.saved.emit();
  }
  
  async removeTitlePhoto(photo){
    
    if(!this.album.titlePhotos) return;
    
    let titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id).map(item => item._id);
    
    await this.dataService.updateAlbum(this.album._id,{titlePhotos:titlePhotos});
    
    this.album.titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id);
    
    this.toastService.toast("Uloženo.");
    
    this.saved.emit();
    
  }

  async saveTags(photo:Photo,tags:string[]){
    await this.dataService.updatePhoto(photo._id,photo);
    photo.tags = tags;
    this.updateTags();
    this.toastService.toast("Uloženo.");
  } 
  
  async editCaption(photo:Photo){
    
    let caption = window.prompt("Zadejte popisek fotky:", photo.caption || "");
    
    if(caption === null) return; // null means cancel
    
    await this.dataService.updatePhoto(photo._id,{caption:caption});
    
    photo.caption = caption;
    
    this.toastService.toast("Uloženo.");
  }
  
  async deletePhoto(photo){
    
    if(!window.confirm("Opravdu chcete smazat toho foto")) return;
    
    await this.dataService.deletePhoto(photo._id);
    
    this.toastService.toast("Foto smazáno.");
    
    this.saved.emit();
  }


}
