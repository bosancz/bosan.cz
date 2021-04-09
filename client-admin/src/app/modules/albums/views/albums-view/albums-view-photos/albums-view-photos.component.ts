import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail } from '@ionic/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../../albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view-photos',
  templateUrl: './albums-view-photos.component.html',
  styleUrls: ['./albums-view-photos.component.scss']
})
export class AlbumsViewPhotosComponent implements OnInit {

  album?: Album<Photo, string>;

  actions: Action[] = [

  ];

  enableOrdering = false;
  enableEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService
  ) { }

  ngOnInit(): void {
    this.albumsService.album$
      .pipe(untilDestroyed(this))
      .subscribe(album => this.updateAlbum(album));
  }

  updateAlbum(album: Album<Photo, string>) {
    this.album = album;
    this.actions = this.getActions(this.album);
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

  private async uploadPhotos() {

  }



  private async deletePhoto() {

  }

  private getActions(album: Album<Photo, string>): Action[] {
    return [
      {
        text: "Seřadit",
        handler: () => this.startOrdering()
      },
      {
        text: "Nahrát fotky",
        icon: "cloud-upload-outline",
        handler: () => this.uploadPhotos()
      },

    ];
  }
}
