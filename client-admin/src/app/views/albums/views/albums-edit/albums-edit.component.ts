import { Component } from '@angular/core';

import { AlbumsService } from '../../albums.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'albums-edit',
  templateUrl: './albums-edit.component.html',
  styleUrls: ['./albums-edit.component.scss']
})
export class AlbumsEditComponent {

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

}
