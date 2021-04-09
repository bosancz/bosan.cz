import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform, ViewWillLeave } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PhotoViewComponent } from 'app/modules/albums/components/photo-view/photo-view.component';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../../albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view-photos',
  templateUrl: './albums-view-photos.component.html',
  styleUrls: ['./albums-view-photos.component.scss']
})
export class AlbumsViewPhotosComponent implements OnInit, ViewWillLeave {

  album?: Album<Photo, string>;

  photos?: Photo[];

  actions: Action[] = [

  ];

  enableOrdering = false;
  enableDeleting = false;

  photoModal?: HTMLIonModalElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService,
    public platform: Platform,
    public modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.albumsService.album$
      .pipe(untilDestroyed(this))
      .subscribe(album => this.loadPhotos(album));
  }

  ionViewWillLeave() {
    this.photoModal?.dismiss();
  }

  async loadPhotos(album: Album<Photo, string>) {
    this.album = album;
    this.photos = undefined;
    this.photos = await this.albumsService.getPhotos(album);
    this.actions = this.getActions(this.album);
  }

  async onPhotoClick(photo: Photo, event: MouseEvent) {
    if (this.enableDeleting || this.enableOrdering) return;

    this.photoModal = await this.modalController.create({
      component: PhotoViewComponent,
      componentProps: {
        "photo": photo,
        "photos": this.photos
      }
    });

    this.photoModal.present();
  }

  private startOrdering() {
    this.enableOrdering = true;
    this.actions = [{
      "text": "Hotovo",
      handler: () => this.endOrdering()
    }];
  }

  async onReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    ev.detail.complete();
  }

  private endOrdering() {
    this.actions = this.getActions(this.album!);
    console.log(this.getActions(this.album!));
    this.enableOrdering = false;
  }

  private startDeleting() {
    this.enableDeleting = true;
    this.actions = [
      {
        text: "Smazat",
        role: "destructive",
        color: "danger",
        handler: () => this.deletePhotos()
      },
      {
        text: "Zrušit",
        hidden: this.platform.is('ios'),
        handler: () => this.endDeleting()
      }
    ];
  }

  private deletePhotos() {
    this.endDeleting();
  }

  endDeleting() {
    this.enableDeleting = false;
    this.actions = this.getActions(this.album!);
  }

  private async uploadPhotos() {

  }



  private async deletePhoto() {

  }

  private getActions(album: Album<Photo, string>): Action[] {
    return [
      {
        text: "Seřadit",
        icon: "swap-vertical-outline",
        handler: () => this.startOrdering()
      },
      {
        text: "Nahrát fotky",
        icon: "cloud-upload-outline",
        handler: () => this.uploadPhotos()
      },
      {
        text: "Smazat fotky",
        color: "danger",
        role: "destructive",
        icon: "trash-outline",
        handler: () => this.startDeleting()
      },

    ];
  }

  getMpix(width: number, height: number) {
    return Math.round(width * height / 1000000);
  }
}
