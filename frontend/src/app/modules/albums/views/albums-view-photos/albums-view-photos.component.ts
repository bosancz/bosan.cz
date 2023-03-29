import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, Platform, ViewWillLeave } from "@ionic/angular";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastService } from "app/core/services/toast.service";
import { PhotosEditComponent } from "app/modules/albums/components/photos-edit/photos-edit.component";
import { PhotosUploadComponent } from "app/modules/albums/components/photos-upload/photos-upload.component";
import { Album, Photo } from "app/schema/album";
import { Action } from "app/shared/components/action-buttons/action-buttons.component";
import { BehaviorSubject } from "rxjs";
import { AlbumsService } from "../../services/albums.service";

@UntilDestroy()
@Component({
  selector: "bo-albums-view-photos",
  templateUrl: "./albums-view-photos.component.html",
  styleUrls: ["./albums-view-photos.component.scss"],
})
export class AlbumsViewPhotosComponent implements OnInit, ViewWillLeave {
  album?: Album<Photo, string>;

  photos?: Photo[];

  actions: Action[] = [];

  photosView: "list" | "grid" = "list";

  enableOrdering = false;
  enableDeleting = false;

  oldOrder?: Photo[];

  showCheckboxes = false;
  selectedPhotos: Photo[] = [];

  photosModal?: HTMLIonModalElement;
  uploadModal?: HTMLIonModalElement;

  constructor(
    private albumsService: AlbumsService,
    public platform: Platform,
    public modalController: ModalController,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      if (this.album?._id !== params["album"]) this.loadPhotos(params["album"]);
    });

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params.photo && !this.photosModal) {
        const photo = this.photos?.find((item) => item._id);
        if (photo) this.openPhoto(photo);
      }
      if (!params.photo && this.photosModal) {
        this.photosModal.dismiss();
      }
    });
  }

  ionViewWillLeave() {
    this.photosModal?.dismiss();
    this.uploadModal?.dismiss();
  }

  async loadPhotos(albumId: string) {
    this.album = await this.albumsService.loadAlbum(albumId);
    this.actions = this.getActions(this.album);

    this.photos = await this.albumsService.getPhotos(albumId);

    if (this.route.snapshot.queryParams["photo"] && !this.photosModal) {
      const photo = this.photos?.find((item) => item._id);
      if (photo) this.openPhoto(photo);
    }
  }

  private async saveAlbum() {}

  onPhotoClick(event: CustomEvent<Photo | undefined>) {
    if (this.enableDeleting || this.enableOrdering) return;

    if (!event.detail) return;

    this.router.navigate([], { queryParams: { photo: event.detail._id } });
  }

  async openPhoto(photo: Photo) {
    if (this.photosModal) this.photosModal.dismiss();

    const originalCount = this.photos?.length;

    this.photosModal = await this.modalController.create({
      component: PhotosEditComponent,
      componentProps: {
        photos: this.photos,
      },
      backdropDismiss: false,
      cssClass: "ion-modal-lg",
    });

    this.photosModal.onWillDismiss().then(() => {
      this.photosModal = undefined;

      if (this.photos?.length !== originalCount) this.loadPhotos(this.album!._id); // album must be present when closing modal
    });

    this.photosModal.present();
  }

  orderByDate() {
    this.photos?.sort((a, b) => a.date.localeCompare(b.date));
  }

  orderByName() {
    this.photos?.sort((a, b) => a.name.localeCompare(b.name));
  }

  startOrdering() {
    this.enableOrdering = true;
    this.photosView = "list";
    this.oldOrder = this.photos?.slice();
    this.actions = [
      {
        text: "Uložit",
        color: "primary",
        pinned: true,
        handler: () => this.saveOrdering().then(() => this.endOrdering()),
      },
      { text: "Podle data", handler: () => this.orderByDate() },
      { text: "Podle jména", handler: () => this.orderByName() },
      {
        text: "Zrušit",
        hidden: this.platform.is("ios"),
        handler: () => this.endOrdering(),
      },
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
        handler: () => this.deletePhotos().then(() => this.endDeleting()),
      },
      {
        text: "Zrušit",
        hidden: this.platform.is("ios"),
        handler: () => this.endDeleting(),
      },
    ];
  }

  endDeleting() {
    this.enableDeleting = false;
    this.stopSelecting();
    this.actions = this.getActions(this.album!);
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

    await this.loadPhotos(this.album!._id); // wouldnt be able to delete photos if no album was present

    toast.dismiss();
    this.toastService.toast("Fotky smazány");
  }

  private async uploadPhotos() {
    if (this.uploadModal) this.uploadModal.dismiss();

    this.uploadModal = await this.modalController.create({
      component: PhotosUploadComponent,
      componentProps: {
        album: this.album,
      },
      backdropDismiss: false,
    });

    this.uploadModal.onDidDismiss().then((event) => {
      if (event.data) this.loadPhotos(this.album!._id);
    });

    this.uploadModal.present();
  }

  private async saveOrdering() {
    if (!this.album || !this.photos) return;

    const data: Pick<Album<string>, "photos"> = {
      photos: this.photos.map((photo) => photo._id),
    };

    await this.albumsService.updateAlbum(this.album._id, data);

    await this.loadPhotos(this.album._id);

    this.oldOrder = undefined;

    this.toastService.toast("Uloženo.");
  }

  private getActions(album: Album<Photo, string>): Action[] {
    return [
      {
        text: "Seřadit",
        icon: "swap-vertical-outline",
        handler: () => this.startOrdering(),
      },
      {
        text: "Nahrát",
        pinned: true,
        icon: "cloud-upload-outline",
        handler: () => this.uploadPhotos(),
      },
      {
        text: "Smazat",
        color: "danger",
        role: "destructive",
        icon: "trash-outline",
        handler: () => this.startDeleting(),
      },
    ];
  }
}
