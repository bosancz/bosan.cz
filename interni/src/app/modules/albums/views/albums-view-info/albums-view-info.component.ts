import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastService } from "app/core/services/toast.service";
import { Album, Photo } from "app/schema/album";
import { Action } from "app/shared/components/action-buttons/action-buttons.component";
import { AlbumsService } from "../../services/albums.service";

@UntilDestroy()
@Component({
  selector: "bo-albums-view-info",
  templateUrl: "./albums-view-info.component.html",
  styleUrls: ["./albums-view-info.component.scss"],
})
export class AlbumsViewInfoComponent implements OnInit {
  album?: Album<Photo, string>;

  actions: Action[] = [];

  alert?: HTMLIonAlertElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService,
    private toastService: ToastService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => this.loadAlbum(params["album"]));
  }

  ngOnDestroy() {
    this.alert?.dismiss();
  }

  async loadAlbum(albumId: string) {
    this.album = await this.albumsService.loadAlbum(albumId);
    this.updateActions(this.album);
  }

  private async publish() {
    if (!this.album?._actions?.publish) return;
    await this.albumsService.albumAction(this.album?._actions?.publish);
    this.album = await this.albumsService.loadAlbum(this.album._id);
    this.toastService.toast("Publikováno.");
    this.updateActions(this.album);
  }

  private async unpublish() {
    if (!this.album?._actions?.unpublish) return;
    await this.albumsService.albumAction(this.album?._actions?.unpublish);
    this.album = await this.albumsService.loadAlbum(this.album._id);
    this.toastService.toast("Skryto.");
    this.updateActions(this.album);
  }

  private async delete() {
    this.alert = await this.alertController.create({
      message: `Opravdu chcete smazat album ${this.album?.name}?`,
      buttons: [
        { text: "Zrušit", role: "cancel" },
        { text: "Smazat", handler: () => this.deleteConfirmed() },
      ],
    });

    this.alert.present();
  }

  private async deleteConfirmed() {
    if (!this.album) return;

    await this.albumsService.deleteAlbum(this.album._id);

    this.toastService.toast("Smazáno.");
    this.router.navigate(["/galerie"], { relativeTo: this.route, replaceUrl: true });
  }

  private open() {
    if (!this.album) return;
    window.open("https://bosan.cz/fotogalerie/" + this.album._id);
  }

  onPhotoClick(event: CustomEvent<Photo>) {
    if (event.detail && this.album) {
      this.navController.navigateForward(`/galerie/${this.album._id}/fotky`, {
        queryParams: { photo: event.detail._id },
      });
    }
  }

  private updateActions(album: Album<Photo, string>) {
    this.actions = [
      {
        text: "Upravit",
        icon: "create-outline",
        pinned: true,
        handler: () => this.router.navigate(["../upravit"], { relativeTo: this.route }),
      },
      {
        text: "Otevřít na webu",
        icon: "open-outline",
        color: "success",
        hidden: album.status !== "public",
        handler: () => this.open(),
      },
      {
        text: "Publikovat",
        icon: "eye-outline",
        hidden: album.status !== "draft",
        handler: () => this.publish(),
      },
      {
        text: "Zrušit publikaci",
        icon: "eye-off-outline",
        hidden: album.status !== "public",
        handler: () => this.unpublish(),
      },
      {
        text: "Smazat",
        role: "destructive",
        icon: "trash",
        color: "danger",
        handler: () => this.delete(),
      },
    ];
  }
}
