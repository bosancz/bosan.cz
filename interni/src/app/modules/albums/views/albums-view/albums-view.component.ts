import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Album, Photo } from 'app/schema/album';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { Subscription } from 'rxjs';
import { AlbumsService } from '../../services/albums.service';
import { AlbumsViewInfoComponent } from './albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './albums-view-photos/albums-view-photos.component';

@UntilDestroy()
@Component({
  selector: 'bo-albums-view',
  templateUrl: './albums-view.component.html',
  styleUrls: ['./albums-view.component.scss']
})
export class AlbumsViewComponent implements OnInit, AfterViewInit {

  album?: Album<Photo, string>;

  @ViewChild("tabs") tabs!: IonTabs;

  actions: Action[] = [];

  actionsSubscription?: Subscription;
  changeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumsService: AlbumsService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        if (this.album?._id !== params["album"]) this.loadAlbum(params["album"]);
      });

  }

  ngAfterViewInit(): void {

    this.tabs.outlet.activateEvents
      .pipe(untilDestroyed(this))
      .subscribe((cmp: AlbumsViewInfoComponent | AlbumsViewPhotosComponent) => {
        this.actionsSubscription?.unsubscribe();
        this.changeSubscription?.unsubscribe();

        this.actionsSubscription = cmp.actions.subscribe(actions => {
          this.actions = actions;
        });

        this.changeSubscription = cmp.change.subscribe(() => this.album && this.loadAlbum(this.album._id));
      });
  }

  async loadAlbum(id: string) {
    this.album = await this.albumsService.loadAlbum(id);
  }

}
