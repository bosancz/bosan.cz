import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";
import { MenuService } from 'app/core/services/menu.service';
import { FooterService } from 'app/core/services/footer.service';

import { Album, Photo } from "app/shared/schema/album";

interface PanEvent {
  pointerType: string;
  overallVelocityX: number;
  velocityX: number;
  srcEvent: PointerEvent;
}

const swipeSpeed = 50; // ms to animate to next or return
const swipeFactor = 0.2; // velocityX above which swipe detected

@Component({
  selector: 'gallery-view-photos',
  templateUrl: './gallery-view-photos.component.html',
  styleUrls: ['./gallery-view-photos.component.scss'],
  animations: [
    trigger('imagesPan', [
      state('pan', style({})),
      state('current', style({ left: 0 })),
      state('prev', style({ left: "100%" })),
      state('next', style({ left: "-100%" })),
      transition('current => prev', [animate(swipeSpeed + "ms")]),
      transition('current => next', [animate(swipeSpeed + "ms")]),
      transition('pan => current', [animate(swipeSpeed + "ms")]),
      transition('pan => next', [animate(swipeSpeed + "ms")]),
      transition('pan => prev', [animate(swipeSpeed + "ms")])
    ]),
    trigger('photoSwitch', [
      transition(':leave', [
        animate('250ms', style({ opacity: 0 })),
        style({ display: "none" })
      ]),
      transition(':enter', style({ opacity: 1, display: "block" }))
    ]),
    trigger('controlsHide', [
      state("visible", style({ opacity: 1 })),
      state("hidden", style({ opacity: 0 })),
      transition('visible => hidden', animate('250ms')),
      transition('hidden => visible', animate('250ms'))
    ])
  ]
})
export class GalleryViewPhotosComponent implements OnInit, AfterViewInit, OnDestroy {

  album: Album;

  currentId: string;

  prevPhoto: Photo;
  nextPhoto: Photo;
  lastPhoto: Photo;
  currentPhoto: Photo;

  currentI: number;

  transition: boolean = false;

  controlsState: string = "visible";

  controlsTimeout: number;

  preloading: HTMLImageElement[] = [];

  private swipeStartX: number;

  public imagesLeft: number = 0;
  public imagesPosition: "pan" | "prev" | "current" | "next";

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private menuService: MenuService,
    private footerService: FooterService,
  ) { }

  ngOnInit() {

    this.menuService.hide();
    this.footerService.hide();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {

      if (!this.album || params.album !== this.album._id) this.loadAlbum(params.album);

      this.currentId = params.photo;

      if (!this.currentPhoto || params.photo !== this.currentPhoto._id) this.updatePhoto(this.currentId);

    });
  }

  ngAfterViewInit() {
    this.showControls();
  }

  ngOnDestroy() {
    this.menuService.reset();
    this.footerService.reset();
    this.paramsSubscription.unsubscribe();
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowLeft": return this.openPreviousPhoto();
      case "ArrowRight": return this.openNextPhoto();
      case "Escape": return this.close();
      case "Home": return this.openPhoto(this.album.photos[0]);
      case "End": return this.openPhoto(this.album.photos[this.album.photos.length - 1]);
    }
  }

  @HostListener('window:mousemove', [])
  onMouseMove() {
    this.showControls();
  }

  async loadAlbum(id: string) {
    this.album = await this.api.get<Album>(["galleryalbum", id]);

    // if(this.album.photos) this.album.photos.sort((a,b) => a.name.localeCompare(b.name));
    // if(this.album.photos) this.album.photos.sort((a,b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());

    this.updatePhoto(this.currentId);

  }

  findPhotoById(photoId: string) {
    let index;

    this.album.photos.some((photo, i) => {
      if (photo._id === photoId) {
        index = i;
        return true;
      }
      return false;
    });

    return index;
  }

  updatePhoto(photoId: string) {
    if (!this.album) return;

    this.showControls();

    this.currentI = this.findPhotoById(photoId);
    this.currentPhoto = this.album.photos[this.currentI];
    this.prevPhoto = this.currentI > 0 ? this.album.photos[this.currentI - 1] : this.album.photos[this.album.photos.length - 1];
    this.nextPhoto = this.currentI < this.album.photos.length - 1 ? this.album.photos[this.currentI + 1] : this.album.photos[0];

    this.imagesLeft = 0;
    this.imagesPosition = "current";

    this.preloadPhotos();
  }

  preloadPhotos() {
    this.preloading = [];
    if (this.currentI + 1 < this.album.photos.length) this.preloadPhoto(this.currentI + 1);
    if (this.currentI - 1 >= 0) this.preloadPhoto(this.currentI - 1);
  }

  preloadPhoto(i: number) {
    let image = new Image();
    image.src = this.album.photos[i].sizes.big.url;
    this.preloading.push(image);
  }

  openPhoto(photo: Photo): void {
    this.router.navigate(["../" + photo._id], { relativeTo: this.route, replaceUrl: true });
  }

  openNextPhoto(): void {
    if (this.currentI >= this.album.photos.length - 1) this.openPhoto(this.album.photos[0]);
    else this.openPhoto(this.album.photos[this.currentI + 1]);
  }

  openPreviousPhoto() {
    if (this.currentI <= 0) this.openPhoto(this.album.photos[this.album.photos.length - 1]);
    else this.openPhoto(this.album.photos[this.currentI - 1]);
  }

  close(): void {
    this.location.back();
  }

  showControls(): void {
    this.controlsState = "visible";
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => this.controlsState = "hidden", 2000);
  }

  @HostListener('panstart', ['$event'])
  onPanStart(event: PanEvent) {
    this.swipeStartX = event.srcEvent.clientX;
    this.imagesPosition = "pan";
  }

  @HostListener('pan', ['$event'])
  onPan(event: PanEvent) {
    if (event.pointerType === "touch") {
      this.imagesLeft = event.srcEvent.clientX - this.swipeStartX;
    }
  }

  @HostListener('panend', ['$event'])
  onPanEnd(event: PanEvent) {

    event.srcEvent.preventDefault();

    if ((-1) * this.imagesLeft > window.innerWidth / 2 || event.velocityX < (-1) * swipeFactor) {
      this.imagesPosition = "next";
      setTimeout(() => this.openNextPhoto(), swipeSpeed); // wait for animation to finish
    }

    else if (this.imagesLeft > window.innerWidth / 2 || event.velocityX > swipeFactor) {
      this.imagesPosition = "prev";
      setTimeout(() => this.openPreviousPhoto(), swipeSpeed); // wait for animation to finish
    }

    else this.imagesPosition = "current";

  }

  onClickLeft() {
    this.lastPhoto = this.currentPhoto;
    this.transition = true;
    this.openPreviousPhoto();
    setTimeout(() => this.transition = false, 0);
  }

  onClickRight() {
    this.lastPhoto = this.currentPhoto;
    this.transition = true;
    this.openNextPhoto();
    setTimeout(() => this.transition = false, 0);
  }

}

