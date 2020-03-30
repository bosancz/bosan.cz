import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { AlbumsService } from '../../albums.service';

import { Album } from "app/shared/schema/album";
import { Member } from "app/shared/schema/member";

@Component({
  selector: 'albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent implements OnInit, OnDestroy {

  album$ = this.albumsService.album$;

  category: string;

  leaders: Member[] = [];

  deleteConfirmation: boolean = false;

  paramsSubscription: Subscription;

  constructor(
    private albumsService: AlbumsService,
    private route: ActivatedRoute
  ) {
    albumsService.album$.subscribe(console.log);
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.albumsService.loadAlbum(params.album);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async deleteAlbum(album: Album) {
    let name = album.name;
    const confirmation = window.confirm(`Opravdu smazat album ${name}?`);

    if (!confirmation) return;

    await this.albumsService.deleteAlbum(album._id);
  }

}
