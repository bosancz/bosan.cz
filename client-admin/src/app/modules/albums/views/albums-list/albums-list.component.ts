import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ViewWillEnter } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Album } from "app/schema/album";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { ThematicBreak } from 'docx';
import { transliterate } from 'inflected';
import { BehaviorSubject } from "rxjs";
import { debounceTime } from 'rxjs/operators';



@UntilDestroy()
@Component({
  selector: 'albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit, OnDestroy, ViewWillEnter {

  albums: Album[] = [];
  filteredAlbums: Album[] = [];

  searchIndex: string[] = [];

  statuses = [
    { id: "public", name: "zveřejněná" },
    { id: "draft", name: "v přípravě" },
  ];

  statusesIndex = this.statuses.reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string; });

  loadingArray = Array(5).fill(null);

  actions: Action[] = [
    {
      text: "Nové",
      handler: () => this.createAlbumModal()
    }
  ];

  alert?: HTMLIonAlertElement;

  searchString = new BehaviorSubject<string>("");

  constructor(
    private api: ApiService,
    private alertController: AlertController,
    private toastService: ToastService,
    private navController: NavController
  ) {

  }

  ngOnInit() {
    this.searchString
      .pipe(untilDestroyed(this))
      .pipe(debounceTime(250))
      .subscribe(searchString => {
        this.filteredAlbums = this.filterAlbums(this.albums, searchString);
      });
  }

  ionViewWillEnter() {
    this.loadAlbums();
  }

  ngOnDestroy() {
    this.alert?.dismiss();
  }

  private async loadAlbums() {

    this.albums = [];

    const albums = await this.api.get<Album[]>("albums");

    albums.sort((a, b) => {
      return a?.status.localeCompare(b.status)
        || b.dateFrom?.localeCompare(a.dateFrom)
        || 0;
    });

    this.searchIndex = albums.map(album => {
      return [
        transliterate(album.name)
      ].filter(item => !!item).join(" ");
    });

    this.albums = albums;
    this.filteredAlbums = this.filterAlbums(this.albums, this.searchString.value);
  }

  private filterAlbums(albums: Album[], searchString: string) {

    if (!searchString) return albums;

    const search_re = new RegExp("(^| )" + transliterate(searchString).replace(/[^a-zA-Z0-9]/g, ""), "i");

    return albums.filter((event, i) => search_re.test(this.searchIndex[i]));
  }

  private async createAlbumModal() {
    this.alert = await this.alertController.create({
      header: "Vytvořit album",
      inputs: [
        { name: "name", type: "text" },
        { name: "dateFrom", type: "date", attributes: { required: true } },
        { name: "dateTill", type: "date", attributes: { required: true } },
      ],
      buttons: [
        { role: "cancel", text: "Zrušit" },
        { text: "Vytvořit", handler: (data: Partial<Pick<Album, "name" | "dateFrom" | "dateTill">>) => this.onCreateAlbum(data) },
      ]
    });

    await this.alert.present();
  }

  private onCreateAlbum(albumData: Partial<Pick<Album, "name" | "dateFrom" | "dateTill">>) {

    // prevent switched date order
    if (albumData.dateFrom && albumData.dateTill) {
      const dates = [albumData.dateFrom, albumData.dateTill];
      dates.sort();
      albumData.dateFrom = dates[0];
      albumData.dateTill = dates[1];
    }

    if (!albumData.name || !albumData.dateFrom || !albumData.dateTill) {
      this.toastService.toast("Musíš vyplnit jméno i datumy");
      return false;
    }

    this.createAlbum(<Pick<Album, "name" | "dateFrom" | "dateTill">>albumData);
  }

  private async createAlbum(albumData: Pick<Album, "name" | "dateFrom" | "dateTill">) {

    if (!albumData.name || !albumData.dateFrom || !albumData.dateTill) {
      this.toastService.toast("Musíš vyplnit jméno i datumy");
      return false;
    }

    const response = await this.api.post("albums", albumData);

    const location = response.headers.get("location");
    if (!location) {
      this.toastService.toast("Chyba při otevírání nového alba.");
      return;
    }

    const album = await this.api.get<Album>({ href: location });

    await this.navController.navigateForward("/galerie/" + album._id);
  }

}
