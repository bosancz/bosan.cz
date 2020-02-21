import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "app/core/services/data.service";
import { ToastService } from "app/admin/services/toast.service";

import { Album } from "app/shared/schema/album";
import { Member } from "app/shared/schema/member";
import { TitleService } from 'app/core/services/title.service';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent {

  album$ = this.albumsService.album$;

  category: string;

  leaders: Member[] = [];

  deleteConfirmation: boolean = false;

  paramsSubscription: Subscription;

  constructor(
    private albumsService: AlbumsService
  ) {
    albumsService.album$.subscribe(console.log);
  }

  async deleteAlbum(album: Album) {
    let name = album.name;
    const confirmation = window.confirm(`Opravdu smazat album ${name}?`);

    if (!confirmation) return;

    await this.albumsService.deleteAlbum(album._id);
  }

}
