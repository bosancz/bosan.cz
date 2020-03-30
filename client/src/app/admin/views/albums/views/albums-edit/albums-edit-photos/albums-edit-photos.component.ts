import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlbumsService } from '../../../albums.service';
import { Photo } from 'app/shared/schema/photo';
import { Album } from 'app/shared/schema/album';

@Component({
  selector: 'albums-edit-photos',
  templateUrl: './albums-edit-photos.component.html',
  styleUrls: ['./albums-edit-photos.component.scss']
})
export class AlbumsEditPhotosComponent {

  album$ = this.albumsService.album$;

  constructor(
    private albumsService: AlbumsService
  ) {

  }

  ngOnInit() {
    this.album$
  }

  async movePhotoBack(album: Album, photo: Photo) {
    const photos = album.photos;
    const i = photos.findIndex(item => item._id === photo._id);
    photos.splice(i - 1, 0, album.photos.splice(i, 1)[0]);
    await this.albumsService.saveAlbum(album._id, { photos: photos.map(photo => photo._id) });
  }

  async movePhotoforward(album: Album, photo: Photo) {
    const photos = album.photos;
    const i = photos.findIndex(item => item._id === photo._id);
    photos.splice(i + 1, 0, album.photos.splice(i, 1)[0]); 
  }

  /* isTitlePhoto(photo) {
    return this.album.titlePhotos && this.album.titlePhotos.some(titlePhoto => titlePhoto._id === photo._id);
  }
 
  async setTitlePhoto(photo) {
 
    let titlePhotos = this.album.titlePhotos ? this.album.titlePhotos.map(item => item._id) : [];
    titlePhotos.push(photo._id);
 
    await this.dataService.updateAlbum(this.album._id, { titlePhotos: titlePhotos });
 
    this.album.titlePhotos.push(photo);
 
    this.toastService.toast("Uloženo.");
  }
 
  async moveTitlePhoto(from: number, to: number) {
 
    if (to < 0 || to >= this.album.titlePhotos.length) return;
 
    let titlePhotos = this.album.titlePhotos ? this.album.titlePhotos.map(photo => photo._id) : [];
    titlePhotos.splice(to, 0, titlePhotos.splice(from, 1)[0]);
 
    await this.dataService.updateAlbum(this.album._id, { titlePhotos: titlePhotos });
 
    this.album.titlePhotos.splice(to, 0, this.album.titlePhotos.splice(from, 1)[0]);
 
    this.toastService.toast("Uloženo.");
 
    this.saved.emit();
  }
 
  async removeTitlePhoto(photo) {
 
    if (!this.album.titlePhotos) return;
 
    let titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id).map(item => item._id);
 
    await this.dataService.updateAlbum(this.album._id, { titlePhotos: titlePhotos });
 
    this.album.titlePhotos = this.album.titlePhotos.filter(item => item._id !== photo._id);
 
    this.toastService.toast("Uloženo.");
 
    this.saved.emit();
 
  }
 
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
