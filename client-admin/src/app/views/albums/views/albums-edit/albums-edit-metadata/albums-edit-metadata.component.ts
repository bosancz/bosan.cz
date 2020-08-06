import { Component } from '@angular/core';
import { formatDate } from "@angular/common";
import { NgForm, FormControl } from "@angular/forms";
import { from } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";
import { AlbumsService } from '../../../albums.service';

import { Album } from "app/shared/schema/album";
import { Event } from "app/shared/schema/event";

@Component({
  selector: 'albums-edit-metadata',
  templateUrl: './albums-edit-metadata.component.html',
  styleUrls: ['./albums-edit-metadata.component.scss']
})
export class AlbumsEditMetadataComponent {

  album$ = this.albumsService.album$;

  dateFrom: string;
  dateTill: string;
  year: number;

  eventsControl = new FormControl();

  eventsMatched$ = this.eventsControl.valueChanges
    .pipe(debounceTime(500))
    .pipe(mergeMap(value => from(this.searchEvents(value))));

  constructor(
    private albumsService: AlbumsService,
    private api: ApiService,
    private toastService: ToastService
  ) {

    this.album$.subscribe(album => {
      if (album.dateFrom) this.dateFrom = album.dateFrom;
      if (album.dateTill) this.dateTill = album.dateTill;
      if (album.year) this.year = album.year;
    })

    this.eventsMatched$.subscribe(console.log)
  }

  ngOnInit() {

  }

  async searchEvents(value: string): Promise<Event[]> {
    return value ? this.api.get<Event[]>("events:search", { search: value }) : [];
  }

  getEventString(event: Event): string {
    if (!event) return "";
    return event.name + " (" + formatDate(event.dateFrom, 'd. M. y', "cs") + " ~ " + formatDate(event.dateTill, 'd. M. y', "cs") + ")";
  }

  async saveAlbum(albumId: Album["_id"], albumForm: NgForm) {

    let albumData = albumForm.value;
    
    albumData.event = albumData.event ? albumData.event._id : null;

    await this.albumsService.saveAlbum(albumId, albumData);

    this.toastService.toast("Uloženo.");
  }

  eventSelected(event: Event) {
    if (!event) return;
    this.dateFrom = event.dateFrom;
    this.dateTill = event.dateTill;
    this.year = (new Date(event.dateTill)).getFullYear();
  }
}
