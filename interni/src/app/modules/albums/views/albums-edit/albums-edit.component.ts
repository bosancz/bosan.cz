import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastService } from 'app/core/services/toast.service';
import { Album, Photo } from 'app/schema/album';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { AlbumsService } from '../../services/albums.service';


@UntilDestroy()
@Component({
  selector: 'albums-edit',
  templateUrl: './albums-edit.component.html',
  styleUrls: ['./albums-edit.component.scss']
})
export class AlbumsEditComponent {

  album?: Album<Photo, string>;

  actions: Action[] = [
    {
      text: "Uložit",
      handler: () => this.saveAlbum()
    }
  ];

  @ViewChild("albumForm") albumForm!: NgForm;

  constructor(
    public albumsService: AlbumsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe(params => this.loadAlbum(params.album));

  }

  private async loadAlbum(albumId: string) {
    this.album = await this.albumsService.loadAlbum(albumId);
  }

  eventUpdated(event: Event) {
    if (!this.album || !event) return;

    this.album.dateFrom = event.dateFrom;
    this.album.dateTill = event.dateTill;
  }

  private async saveAlbum() {

    if (!this.album) return;

    if (this.albumForm.invalid) {
      this.toastService.toast("Nelze uložit, zkontrolujte údaje.");
      return;
    }

    let albumData: Partial<Album<string>> = this.albumForm.value;

    // prevent switched date order
    if (albumData.dateFrom && albumData.dateTill) {
      const dates = [albumData.dateFrom, albumData.dateTill];
      dates.sort();
      albumData.dateFrom = dates[0];
      albumData.dateTill = dates[1];
    }

    await this.albumsService.updateAlbum(this.album._id, albumData);

    this.toastService.toast("Uloženo.");

    this.navController.navigateBack(["/galerie", this.album._id]);
  }

}
