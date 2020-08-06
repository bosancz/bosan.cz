import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpEvent, HttpEventType, HttpClient } from "@angular/common/http";

import { ApiService } from 'app/services/api.service';

import { Album, Photo } from "app/shared/schema/album";
import { AlbumsService } from 'app/views/albums/albums.service';

class PhotoUploadItem {
  file: File;
  progress: number;
  status: string;
  error?: Error;
}

@Component({
  selector: 'albums-edit-upload',
  templateUrl: './albums-edit-upload.component.html',
  styleUrls: ['./albums-edit-upload.component.scss']
})
export class AlbumsEditUploadComponent {

  album$ = this.albumsService.album$;

  @Output() saved: EventEmitter<void> = new EventEmitter();

  tags: string[] = [];
  selectedTags: string[] = [];

  status: string = "notstarted";

  photoUploadQueue: PhotoUploadItem[] = [];

  allowedFiles_re = /\.(jpg|jpeg|png|gif)$/i;

  constructor(
    private albumsService: AlbumsService,
    private api: ApiService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {
    this.album$.subscribe(album => this.updateTags(album));
  }

  updateTags(album: Album<Photo, string>) {
    this.tags = [];
    album.photos.forEach(photo => {
      photo.tags.filter(tag => this.tags.indexOf(tag) === -1).forEach(tag => this.tags.push(tag));
    });
  }

  addPhotosByInput(photoInput: HTMLInputElement) {

    if (!photoInput.files.length) return;

    for (let i = 0; i < photoInput.files.length; i++) {
      this.photoUploadQueue.push({
        file: photoInput.files[i],
        progress: 0,
        status: "pending"
      });
    }

  }

  addPhotosByDropzone(event: DragEvent, dropZone: HTMLDivElement) {
    event.preventDefault();

    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      this.photoUploadQueue.push({
        file: event.dataTransfer.files[i],
        progress: 0,
        status: "pending"
      });
    }

  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  removeFromQueue(uploadItem: PhotoUploadItem) {
    let i = this.photoUploadQueue.indexOf(uploadItem);
    if (i !== -1) this.photoUploadQueue.splice(i, 1);
  }

  clearQueue() {
    this.photoUploadQueue = [];
  }

  async uploadPhotos(album: Album) {

    this.status = "started";

    let uploadItem: PhotoUploadItem;
    for (uploadItem of this.photoUploadQueue) {

      if (uploadItem.status === "finished") continue;

      try {
        uploadItem.status = "uploading";
        await this.uploadPhoto(album, uploadItem);
        uploadItem.status = "finished";
      }
      catch (err) {
        uploadItem.status = "error";
        uploadItem.error = err;
      }
    }

    this.status = "finished";
    this.saved.emit();

    this.albumsService.loadAlbum(album._id);

  }

  async uploadPhoto(album: Album, uploadItem: PhotoUploadItem): Promise<void> {

    if (!this.allowedFiles_re.test(uploadItem.file.name)) {
      throw new Error("Unsupported file type.");
    }

    let formData: FormData = new FormData();

    formData.set("album", album._id);
    formData.set("tags", this.selectedTags.join(","));
    formData.set("photo", uploadItem.file, uploadItem.file.name);
    formData.set("lastModified", uploadItem.file.lastModified ? new Date(uploadItem.file.lastModified).toISOString() : undefined);

    const uploadPath = await this.api.path2href("photos");

    return new Promise<void>((resolve, reject) => {

      this.http.post(uploadPath, formData, { withCredentials: true, observe: 'events', reportProgress: true, responseType: "text" }).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {

            case HttpEventType.Sent:
              break;

            case HttpEventType.UploadProgress:
              uploadItem.progress = Math.round(event.loaded / event.total * 100);
              this.cdRef.markForCheck();
              if (event.loaded === event.total) uploadItem.status = "processing";
              break;

            case HttpEventType.Response:
              uploadItem.progress = 100;
              resolve();
              break;
          }
        }, err => reject(err));

    });
  }

}

