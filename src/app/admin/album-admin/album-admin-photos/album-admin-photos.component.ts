import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { GalleryPhoto } from "../../../components/photo-gallery/photo-gallery.component";

import { Album, AlbumPhoto } from "../../../schema/album";

@Component({
  selector: 'album-admin-photos',
  templateUrl: './album-admin-photos.component.html',
  styleUrls: ['./album-admin-photos.component.css']
})
export class AlbumAdminPhotosComponent implements OnInit {

  @Input() album:Album;
  
    
  galleryPhotos:GalleryPhoto[] = [];
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  ngOnInit() {
  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.album) this.updateGalleryPhotos();
  }

  updateGalleryPhotos(){
    this.galleryPhotos = this.album.photos.map(photo => ({
      url: photo.sizes.small.url,
      width: photo.sizes.small.width,
      height: photo.sizes.small.height,
      caption: photo.caption,
      bg: photo.bg
    }));
  }
  
  async setTitlePhoto(photo){
    await this.dataService.updateAlbum(this.album._id,{titlePhoto:photo._id});
    this.album.titlePhoto = photo;
    this.toastService.toast("Uloženo.");
  }
  
  async savePhotos(){
    await this.dataService.updateAlbumPhotos(this.album._id,this.album.photos);
    this.toastService.toast("Uloženo.");
  }  
  
  async deletePhoto(photo){
    
    if(!window.confirm("Opravdu chcete smazat toho foto")) return;
    
    await this.dataService.deleteAlbumPhoto(this.album._id,photo._id)
    
    this.toastService.toast("Foto smazáno.");
    
    this.save.emit();
  }

}
