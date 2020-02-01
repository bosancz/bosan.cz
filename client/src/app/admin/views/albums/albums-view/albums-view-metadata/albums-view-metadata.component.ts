import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { formatDate } from "@angular/common";
import { NgForm } from "@angular/forms";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Album } from "app/shared/schema/album";
import { Event } from "app/shared/schema/event";

@Component({
  selector: 'albums-view-metadata',
  templateUrl: './albums-view-metadata.component.html',
  styleUrls: ['./albums-view-metadata.component.scss']
})
export class AlbumsViewMetadataComponent {

  @Input() album: Album;

  @Output() save: EventEmitter<void> = new EventEmitter();

  dateFrom: string;
  dateTill: string;
  year: number;

  eventsMatched: Event[] = [];

  constructor(private api: ApiService, private toastService: ToastService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.album) {
      if (this.album.dateFrom) this.dateFrom = this.album.dateFrom;
      if (this.album.dateTill) this.dateTill = this.album.dateTill;
      if (this.album.year) this.year = this.album.year;
    }
  }

  async loadTypeaheadEvents(search: string) {
    if(!search) {
      this.eventsMatched = [];
      return;
    }
    this.eventsMatched = await this.api.get<Event[]>("events:search", { search: search });
  }

  getEventString(event: Event): string {
    if (!event) return "";
    return event.name + " (" + formatDate(event.dateFrom, 'd. M. y', "cs") + " ~ " + formatDate(event.dateTill, 'd. M. y', "cs") + ")";
  }

  async saveAlbum(albumForm: NgForm) {

    let albumData = albumForm.value;
    albumData.event = albumData.event ? albumData.event._id : null;

    await this.api.patch(this.album._links.self, albumData);

    this.toastService.toast("Uloženo.");

    this.save.emit();
  }

  eventSelected(event: Event) {
    if (!event) return;
    this.dateFrom = event.dateFrom;
    this.dateTill = event.dateTill;
    this.year = (new Date(event.dateTill)).getFullYear();
  }
}
