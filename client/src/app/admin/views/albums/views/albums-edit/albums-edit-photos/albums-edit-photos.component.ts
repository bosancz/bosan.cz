import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlbumsService } from '../../../albums.service';
import { Photo } from 'app/shared/schema/photo';
import { Album } from 'app/shared/schema/album';
import { Subscription } from 'rxjs';
import { ToastService } from 'app/admin/services/toast.service';

@Component({
  selector: 'albums-edit-photos',
  templateUrl: './albums-edit-photos.component.html',
  styleUrls: ['./albums-edit-photos.component.scss']
})
export class AlbumsEditPhotosComponent implements OnInit, OnDestroy {

  album: Album<Photo, string>;

  photos: Photo[] = [];
  titlePhotos: string[] = [];

  albumSubscription: Subscription;

  constructor(
    private albumsService: AlbumsService,
    private toastService: ToastService
  ) {

  }

  ngOnInit() {
    this.albumSubscription = this.albumsService.album$.subscribe(album => {
      this.album = album;
      this.photos = album.photos.slice()
      this.titlePhotos = album.titlePhotos.slice();
    });
  }

  ngOnDestroy() {
    this.albumSubscription.unsubscribe();
  }

  async savePhotos() {
    await this.albumsService.saveAlbum(this.album._id, { photos: this.photos.map(photo => photo._id) });
    this.album.photos = this.photos;
    this.toastService.toast("Uloženo.");
  }

  async saveTitlePhotos() {
    await this.albumsService.saveAlbum(this.album._id, { titlePhotos: this.titlePhotos });
    this.album.titlePhotos = this.titlePhotos;
    this.toastService.toast("Uloženo.");
  }


  async movePhotoBack(photo: Photo) {
    const i = this.photos.findIndex(item => item._id === photo._id);
    this.photos.splice(i - 1, 0, this.photos.splice(i, 1)[0]);
    this.savePhotos();
  }

  async movePhotoforward(photo: Photo) {
    const i = this.photos.findIndex(item => item._id === photo._id);
    this.photos.splice(i + 1, 0, this.photos.splice(i, 1)[0]);
    this.savePhotos();
  }

  titlePhotoIndex(photo: Photo): number {
    if (!this.titlePhotos) return 0;
    return this.titlePhotos.indexOf(photo._id) + 1;
  }

  async addTitlePhoto(photo: Photo) {

    this.titlePhotos.push(photo._id);

    this.saveTitlePhotos();
  }

  async removeTitlePhoto(photo: Photo) {

    if (!this.titlePhotos) return;

    this.titlePhotos = this.album.titlePhotos.filter(item => item !== photo._id && !!item);

    this.saveTitlePhotos();

  }
  /*
    async saveTags(photo: Photo, tags: string[]) {
      await this.dataService.updatePhoto(photo._id, photo);
      photo.tags = tags;
      this.updateTags();
      this.toastService.toast("Uloženo.");
    }
  
    async editCaption(photo: Photo) {
  
      let caption = window.prompt("Zadejte popisek fotky:", photo.caption || "");
  
      if (caption === null) return; // null means cancel
  
      await this.dataService.updatePhoto(photo._id, { caption: caption });
  
      photo.caption = caption;
  
      this.toastService.toast("Uloženo.");
    }
  
    async deletePhoto(photo) {
  
      if (!window.confirm("Opravdu chcete smazat toho foto")) return;
  
      await this.dataService.deletePhoto(photo._id);
  
      this.toastService.toast("Foto smazáno.");
  
      this.saved.emit();
    }
    */

}
