import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlbumsService } from '../../albums.service';

import { Album } from 'app/shared/schema/album';

@Component({
  selector: 'albums-edit',
  templateUrl: './albums-edit.component.html',
  styleUrls: ['./albums-edit.component.scss']
})
export class AlbumsEditComponent {

  album$ = this.albumsService.album$;

  deleteConfirmation: boolean = false;

  paramsSubscription: Subscription;

  constructor(
    public albumsService: AlbumsService,
    private route: ActivatedRoute
  ) { }

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
