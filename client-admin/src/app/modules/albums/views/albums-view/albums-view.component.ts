import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent implements OnInit {

  album?: Album<Photo, string>;

  actions: Action[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe(params => this.loadAlbum(params["album"]));
  }

  async loadAlbum(id: string) {
    this.album = await this.albumsService.loadAlbum(id);
    this.actions = this.getActions(this.album);
  }

  private async uploadPhotos() {

  }

  private async publish() {

  }

  private async unpublish() {

  }

  private async delete() {

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
        handler: () => this.router.navigate(["upravit"], { relativeTo: this.route })
      },
      {
        text: "Upravit fotky",
        icon: "list-outline",
        handler: () => this.uploadPhotos()
      },
      {
        text: "Nahrát fotky",
        icon: "cloud-upload-outline",
        handler: () => this.uploadPhotos()
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
