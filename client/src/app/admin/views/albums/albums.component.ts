import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { AlbumsService } from './albums.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'albums',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AlbumsComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;

  constructor(
    public albumsService: AlbumsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params
      .pipe(map((params: Params) => params.album))
      .subscribe(albumId => this.albumsService.loadAlbum(albumId));
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
