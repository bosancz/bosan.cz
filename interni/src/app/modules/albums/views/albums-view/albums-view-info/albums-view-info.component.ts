import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from 'app/core/services/toast.service';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../../services/albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view-info',
  templateUrl: './albums-view-info.component.html',
  styleUrls: ['./albums-view-info.component.scss']
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
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.albumsService.album$
      .pipe(untilDestroyed(this))
      .subscribe(album => this.updateAlbum(album));
  }

  ngOnDestroy() {
    this.alert?.dismiss();
  }

  updateAlbum(album: Album<Photo, string>) {
    this.album = album;
    this.actions = this.getActions(this.album);
  }

  private async publish() {
    if (!this.album?._actions?.publish) return;
    await this.albumsService.albumAction(this.album?._actions?.publish);
    await this.albumsService.loadAlbum(this.album._id);
    this.toastService.toast("Publikováno.");
  }

  private async unpublish() {
    if (!this.album?._actions?.unpublish) return;
    await this.albumsService.albumAction(this.album?._actions?.unpublish);
    await this.albumsService.loadAlbum(this.album._id);
    this.toastService.toast("Skryto.");
  }

  private async delete() {
    this.alert = await this.alertController.create({
      message: `Opravdu chcete smazat album ${this.album?.name}?`,
      buttons: [
        { text: "Zrušit", role: "cancel" },
        { text: "Smazat", handler: () => this.deleteConfirmed() }
      ]

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

  private getActions(album: Album<Photo, string>): Action[] {
    return [
      {
        text: "Upravit",
        icon: "create-outline",
        pinned: true,
        handler: () => this.router.navigate(["../upravit"], { relativeTo: this.route })
      },
      {
        text: "Otevřít na webu",
        icon: "open-outline",
        color: "success",
        disabled: album.status !== "public",
        handler: () => this.open(),
      },
      {
        text: "Publikovat",
        icon: "eye-outline",
        hidden: album.status !== "draft",
        handler: () => this.publish()
      },
      {
        text: "Zrušit publikaci",
        icon: "eye-off-outline",
        hidden: album.status !== "public",
        handler: () => this.unpublish()
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
