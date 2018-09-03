import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { HttpEvent, HttpEventType } from "@angular/common/http";

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { Album, Photo } from "../../../../../schema/album";

class PhotoUploadItem {
  file:File;
  progress:number;
  status:string;
  error?:Error;
}

@Component({
  selector: 'album-admin-upload',
  templateUrl: './album-admin-upload.component.html',
  styleUrls: ['./album-admin-upload.component.css']
})
export class AlbumAdminUploadComponent implements OnChanges {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  tags:string[] = [];
  selectedTags:string[] = [];
  
  status:string = "notstarted";

  photoUploadQueue:PhotoUploadItem[] = [];

  allowedFiles = ["jpg","jpeg","png","gif"];

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
  
  addPhotosByInput(photoInput:HTMLInputElement){

    if(!photoInput.files.length) return;

    for( var i = 0; i < photoInput.files.length; i++ ){
      this.photoUploadQueue.push({
        file: photoInput.files[i],
        progress: 0,
        status: "pending"
      });
    }    

  }

  addPhotosByDropzone(e, dropzone:HTMLDivElement){
    e.preventDefault();

    for( var i = 0; i < e.dataTransfer.files.length; i++ ){
      this.photoUploadQueue.push({
        file: e.dataTransfer.files[i],
        progress: 0,
        status: "pending"
      });
    }    

  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  removeFromQueue(uploadItem:PhotoUploadItem){
    let i = this.photoUploadQueue.indexOf(uploadItem);
    if(i !== -1) this.photoUploadQueue.splice(i,1);
  }
  
  clearQueue(){
    this.photoUploadQueue = [];
  }

  async uploadPhotos(){
    
    this.status = "started";
    
    let uploadItem:PhotoUploadItem;
    for(uploadItem of this.photoUploadQueue){
      
      if(uploadItem.status === "finished") continue;

      try{
        uploadItem.status = "uploading";
        await this.uploadPhoto(uploadItem);
        uploadItem.status = "finished";
      }
      catch(err) {
        uploadItem.status  = "error";
        uploadItem.error = err;
      }
    }

    this.status = "finished";
    this.save.emit();

  }

  uploadPhoto(uploadItem:PhotoUploadItem):Promise<void>{

    return new Promise((resolve,reject) => {
      
      if(this.allowedFiles.indexOf(uploadItem.file.name.split(".").pop().toLowerCase()) === -1){
        return reject(new Error("Unsupported file type."));
      }

      let formData: FormData = new FormData();

      formData.set("album",this.album._id);
      formData.set("tags",this.selectedTags.join(","));
      formData.set("photo",uploadItem.file,uploadItem.file.name);
      formData.set("lastModified",uploadItem.file.lastModifiedDate.toISOString());

      this.dataService.createPhoto(formData).subscribe(
        (event:HttpEvent<any>) => {
          switch(event.type){
              
            case HttpEventType.Sent:
              break;
            
            case HttpEventType.UploadProgress:
              uploadItem.progress = Math.round(event.loaded / event.total * 100);
              if(event.loaded === event.total) uploadItem.status = "processing";
              break;
            
            case HttpEventType.Response:
              resolve();
              break;
          }
        }, err => reject(err));
    });

  }
 
}

