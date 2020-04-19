import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Subscription} from "rxjs";

import {ApiService} from "app/services/api.service";

import {Album, Photo} from "app/shared/schema/album";

import {GalleryPhoto} from "app/shared/components/photo-gallery/photo-gallery.component";

class GalleryPhotoContainer implements GalleryPhoto {

  photo: Photo;

  // GalleryPhoto
  url: string;
  width: number;
  height: number;
  caption: string;
  bg: string;
}
@Component({
  selector: 'gallery-view-album',
  templateUrl: './gallery-view-album.component.html',
  styleUrls: ['./gallery-view-album.component.scss']
})
export class GalleryViewAlbumComponent implements OnInit, OnDestroy {

  album: Album;

  tags: string[] = [];
  tag: string;

  galleryPhotos: GalleryPhoto[] = [];

  tagClasses = ["red-button", "green-button", "blue-button"]

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {

      if (!this.album || params.album !== this.album._id) this.loadAlbum(params.album);

      if (params.tag !== this.tag) {
        this.tag = params.tag;
        this.updateGalleryPhotos();
      }

    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadAlbum(id: string) {
    try {
      this.album = await this.api.get<Album>(["galleryalbum", id]);
    }
    catch (err) {
      this.router.navigate(["/nenalezeno"]);
    }

    this.updateTags();
    this.updateGalleryPhotos();
  }

  updateTags() {

    let tagIndex = {};

    this.album.photos.forEach(photo => {
      photo.tags.forEach(tag => tagIndex[tag] = 1);
    });

    this.tags = Object.keys(tagIndex);
  }

  updateGalleryPhotos() {
    // album not yet loaded
    if (!this.album) return;

    let galleryPhotos = this.album.photos.filter(photo => this.hasTag(photo, this.tag)).map(photo => ({
      photo: photo,
      url: photo.sizes.small.url,
      width: photo.sizes.small.width,
      height: photo.sizes.small.height,
      caption: photo.caption,
      bg: photo.bg
    }));

    this.galleryPhotos = galleryPhotos;
  }

  hasTag(photo: Photo, tag: string) {
    if (!tag) return true;
    if (!photo.tags) return false;
    return photo.tags.indexOf(tag) !== -1;
  }

  openPhoto(container: GalleryPhotoContainer) {
    this.router.navigate(['./' + container.photo._id], { relativeTo: this.route });
  }

  getAlbumDownloadLink(album: Album): string {
    return this.api.link2href(album._links.download);
  }

  tagClass(tag: string){
    let hash = 0;
    if (tag.length === 0) return hash;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    let length = this.tagClasses.length;
    hash = ((hash % length) + length) % length;

    return this.tagClasses[hash];
  }
}
