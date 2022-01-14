import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ViewWillLeave } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from 'app/core/services/toast.service';
import { PhotoViewComponent } from 'app/modules/albums/components/photo-view/photo-view.component';
import { PhotosUploadComponent } from 'app/modules/albums/components/photos-upload/photos-upload.component';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../../services/albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view-photos',
  templateUrl: './albums-view-photos.component.html',
  styleUrls: ['./albums-view-photos.component.scss']
})
export class AlbumsViewPhotosComponent implements OnInit, ViewWillLeave {

  album?: Album<Photo, string>;

  photos?: Photo[] = [];

  loadingPhotos?: any[] = Array(5).fill(true);

  actions: Action[] = [

  ];

  enableOrdering = false;
  enableDeleting = false;

  oldOrder?: Photo[];

  showCheckboxes = false;
  selectedPhotos: Photo[] = [];

  modal?: HTMLIonModalElement;

  constructor(
    private albumsService: AlbumsService,
    public platform: Platform,
    public modalController: ModalController,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.albumsService.album$
      .pipe(untilDestroyed(this))
      .subscribe(album => {
        this.album = album;
        this.actions = this.getActions(this.album);
        this.loadPhotos(album);
      });
  }

  ionViewWillLeave() {
    this.modal?.dismiss();
  }

  async loadPhotos(album: Album<Photo, string>) {
    this.photos = await this.albumsService.getPhotos(album);
    this.loadingPhotos = undefined;
  }

  async onPhotoClick(photo: Photo, event: MouseEvent) {
    if (this.enableDeleting || this.enableOrdering) return;

    if (this.modal) this.modal.dismiss();

    this.modal = await this.modalController.create({
      component: PhotoViewComponent,
      componentProps: {
        "photo": photo,
        "photos": this.photos
      },
      backdropDismiss: false
    });

    this.modal.present();
  }


  onPhotoCheck(photo: Photo, isChecked: boolean) {
    const i = this.selectedPhotos.indexOf(photo);

    // if checked, but not in list, add photo 
    if (isChecked && i === -1) this.selectedPhotos.push(photo);

    // if not checked, but in list, remove photo
    else if (!isChecked && i !== -1) this.selectedPhotos.splice(i, 1);

    console.log(this.selectedPhotos);
  }

  onReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.photos?.splice(ev.detail.to, 0, this.photos?.splice(ev.detail.from, 1)[0]);
    ev.detail.complete();
  }

  orderByDate() {
    this.photos?.sort((a, b) => a.date.localeCompare(b.date));
  }

  orderByName() {
    this.photos?.sort((a, b) => a.name.localeCompare(b.name));
  }

  startOrdering() {
    this.enableOrdering = true;
    this.oldOrder = this.photos?.slice();
    this.actions = [
      {
        "text": "Uložit",
        color: "primary",
        pinned: true,
        handler: () => this.saveOrdering().then(() => this.endOrdering())
      },
      { "text": "Podle data", handler: () => this.orderByDate() },
      { "text": "Podle jména", handler: () => this.orderByName() },
      {
        text: "Zrušit",
        hidden: this.platform.is('ios'),
        handler: () => this.endOrdering()
      }
    ];
  }

  endOrdering() {
    if (this.oldOrder) {
      this.photos = this.oldOrder;
      this.oldOrder = undefined;
    }
    this.actions = this.getActions(this.album!);
    this.enableOrdering = false;
  }

  startDeleting() {
    this.startSelecting();
    this.enableDeleting = true;
    this.actions = [
      {
        text: "Smazat",
        role: "destructive",
        color: "danger",
        pinned: true,
        handler: () => this.deletePhotos().then(() => this.endDeleting())
      },
      {
        text: "Zrušit",
        hidden: this.platform.is('ios'),
        handler: () => this.endDeleting()
      }
    ];
  }

  endDeleting() {
    this.enableDeleting = false;
    this.stopSelecting();
    this.actions = this.getActions(this.album!);
  }


  getMpix(width: number, height: number) {
    return Math.round(width * height / 1000000);
  }

  private startSelecting() {
    this.showCheckboxes = true;
    this.selectedPhotos = [];
  }

  private stopSelecting() {
    this.showCheckboxes = false;
    this.selectedPhotos = [];
  }


  private async deletePhotos() {

    const toast = await this.toastService.toast("Mažu fotky...");

    for (let photo of this.selectedPhotos) {
      await this.albumsService.deletePhoto(photo._id);
    }

    await this.loadPhotos(this.album!); // wouldnt be able to delete photos if no album was present

    toast.dismiss();
    this.toastService.toast("Fotky smazány");
  }

  private async deletePhoto(photo: Photo) {
    await this.albumsService.deletePhoto(photo._id);
  }

  private async uploadPhotos() {
    if (this.modal) this.modal.dismiss();

    this.modal = await this.modalController.create({
      component: PhotosUploadComponent,
      componentProps: {
        album: this.album
      },
      backdropDismiss: false
    });

    this.modal.present();

    this.modal.onDidDismiss().then(saved => saved && this.albumsService.loadAlbum(this.album!._id));
  }

  private async saveOrdering() {
    if (!this.album || !this.photos) return;

    const data: Pick<Album<string>, "photos"> = {
      photos: this.photos.map(photo => photo._id)
    };

    await this.albumsService.updateAlbum(this.album._id, data);

    await this.loadPhotos(this.album);

    this.oldOrder = undefined;

    this.toastService.toast("Uloženo.");
  }

  private getActions(album: Album<Photo, string>): Action[] {
    return [
      {
        text: "Seřadit",
        icon: "swap-vertical-outline",
        handler: () => this.startOrdering()
      },
      {
        text: "Nahrát",
        icon: "cloud-upload-outline",
        handler: () => this.uploadPhotos()
      },
      {
        text: "Smazat",
        color: "danger",
        role: "destructive",
        icon: "trash-outline",
        handler: () => this.startDeleting()
      },

    ];
  }

};
