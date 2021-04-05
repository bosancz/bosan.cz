import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlbumsService } from '../../albums.service';

import { Album } from 'app/schema/album';
import { ToastService } from 'app/core/services/toast.service';
import { ApiService } from 'app/core/services/api.service';

@Component({
  selector: 'albums-edit',
  templateUrl: './albums-edit.component.html',
  styleUrls: ['./albums-edit.component.scss']
})
export class AlbumsEditComponent {

  album$ = this.albumsService.album$;

  deleteConfirmation: boolean = false;

  paramsSubscription?: Subscription;

  constructor(
    public albumsService: AlbumsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.albumsService.loadAlbum(params.album);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  async deleteAlbum(album: Album<any, any>) {
    let name = album.name;
    const confirmation = window.confirm(`Opravdu smazat album ${name}?`);

    if (!confirmation) return;

    await this.albumsService.deleteAlbum(album._id);

    this.router.navigate(["/galerie"]);
  }

  async albumAction(album: Album<any, any>, action: string) {

    if (!album._actions?.[action].allowed) {
      this.toastService.toast("K této akci nemáš oprávnění.");
      return;
    }

    await this.api.post(album._actions[action]);

    await this.albumsService.loadAlbum(album._id);

    this.toastService.toast("Uloženo");
  }

}
