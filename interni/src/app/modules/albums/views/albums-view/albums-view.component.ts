import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Album, Photo } from 'app/schema/album';
import { AlbumsService } from '../../services/albums.service';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent implements OnInit {

  album?: Album<Photo, string>;

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
  }

}
