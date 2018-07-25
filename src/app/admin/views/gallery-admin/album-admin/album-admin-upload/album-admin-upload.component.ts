import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpEvent, HttpEventType } from "@angular/common/http";

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { Album, AlbumPhoto } from "../../../../../schema/album";

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
export class AlbumAdminUploadComponent {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  status:string = "notstarted";

  photoUploadQueue:PhotoUploadItem[] = [];

  allowedFiles = ["jpg","jpeg","png","gif"];

  constructor(private dataService:DataService, private toastService:ToastService) { }

  async addPhotosByInput(photoInput:HTMLInputElement){

    if(!photoInput.files.length) return;

    for( var i = 0; i < photoInput.files.length; i++ ){
      this.photoUploadQueue.push({
        file: photoInput.files[i],
        progress: 0,
        status: "pending"
      });
    }    

    this.uploadPhotos();

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

    this.uploadPhotos();

  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  async uploadPhotos(){
    
    this.status = "started";
    

    let uploadItem:PhotoUploadItem;
    for(uploadItem of this.photoUploadQueue){
      
      if(uploadItem.status === "finished") continue;

      try{
        uploadItem.status = "started";
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

      formData.set("photo",uploadItem.file,uploadItem.file.name);
      formData.set("lastModified",uploadItem.file.lastModifiedDate.toISOString());

      this.dataService.createAlbumPhoto(this.album._id,formData).subscribe(
        (event:HttpEvent<any>) => {
          switch(event.type){
              
            case HttpEventType.Sent:
              break;
            
            case HttpEventType.UploadProgress:
              uploadItem.progress = Math.round(event.loaded / event.total * 100);
              if(uploadItem.progress === 1) uploadItem.status = "processing";
              break;
            
            case HttpEventType.Response:
              resolve();
              break;
          }
        }, err => reject(err));
    });

  }
}

