import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { GalleryPhoto } from "../../../../../components/photo-gallery/photo-gallery.component";

import { Album, Photo } from "../../../../../schema/album";

@Component({
  selector: 'album-admin-photos',
  templateUrl: './album-admin-photos.component.html',
  styleUrls: ['./album-admin-photos.component.scss']
})
export class AlbumAdminPhotosComponent {

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
    
    this.saved.emit();
  }
  
  async removeTitlePhoto(photo){
    
    if(!this.album.titlePhotos) return;
    
    let titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id).map(photo => photo._id);
    
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
  
  async deletePhoto(photo){
    
    if(!window.confirm("Opravdu chcete smazat toho foto")) return;
    
    await this.dataService.deletePhoto(photo._id)
    
    this.toastService.toast("Foto smazáno.");
    
    this.saved.emit();
  }


}
