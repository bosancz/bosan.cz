import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ToastService } from "app/admin/services/toast.service";

import { Album, Photo } from "app/shared/schema/album";
import { AlbumsService } from '../albums.service';
import { mergeMap, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { from, combineLatest, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'app/core/services/api.service';

@Component({
  selector: 'albums-edit-photos',
  templateUrl: './albums-edit-photos.component.html',
  styleUrls: ['./albums-edit-photos.component.scss']
})
export class AlbumsEditPhotosComponent {

  album$ = this.albumsService.album$;

  // tags$ = this.album$.pipe(map(album => this.getTags(album)));

  currentPhotoId: string;
  previousPhotoId: string;
  nextPhotoId: string;

  paramsSubscription: Subscription;

  constructor(
    private albumsService: AlbumsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {


  }

  ngOnInit() {

    this.paramsSubscription = combineLatest(this.album$, this.route.params.pipe(map((params: Params) => params.photo)))
      .subscribe(([album, photoId]) => {
        const i = album.photos.findIndex(photo => photo._id === photoId);
        if (i === -1) this.selectPhoto(album.photos[0]._id);
        else {
          this.currentPhotoId = album.photos[i]._id;
          this.previousPhotoId = i > 0 ? album.photos[i - 1]._id : album.photos[album.photos.length - 1]._id;
          this.nextPhotoId = i < album.photos.length - 1 ? album.photos[i + 1]._id : album.photos[0]._id;
        }
      });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  selectPhoto(photoId: string | null) {
    if (photoId) {
      this.router.navigate(["../", photoId], { replaceUrl: true, relativeTo: this.route });
    }
    else {
      this.router.navigate(["../"], { replaceUrl: true, relativeTo: this.route });
    }
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
