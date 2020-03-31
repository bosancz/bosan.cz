import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, Scroll, RouterEvent } from "@angular/router";

import { filter } from "rxjs/operators";

import { ApiService } from "app/services/api.service";

import { Paginated } from "app/shared/schema/paginated";
import { Album } from "app/shared/schema/album";

import { TimelinePoint, TimelineLabel } from "app/shared/components/timeline-scroll/timeline-scroll.component";
import { FooterService } from 'app/services/footer.service';

class TimelineAlbumContainer implements TimelinePoint {
  y: number;
  title: string;

  _id: string;
  name: string;
  dateFrom: Date;
  dateTill: Date;
  album: Album;

  loading?: boolean = false;
}

@Component({
  selector: 'gallery-view-timeline',
  templateUrl: './gallery-view-timeline.component.html',
  styleUrls: ['./gallery-view-timeline.component.scss']
})
export class GalleryViewTimelineComponent implements OnInit, OnDestroy {

  @ViewChild('gallery', { static: true }) container: ElementRef<HTMLElement>;

  timeline: TimelineAlbumContainer[] = [];
  timelineLabels: TimelineLabel[] = [];

  loading: boolean = false;

  lastRouterScrollEvent: Scroll;

  constructor(
    private api: ApiService,
    private footerService: FooterService,
    router: Router,
    private viewportScroller: ViewportScroller
  ) {
    
    router.events.pipe(filter<Scroll>(e => e instanceof Scroll)).subscribe(e => this.lastRouterScrollEvent = e);

    footerService.hide();
  }

  ngOnInit() {
    this.loadAlbumsList().then(() => setTimeout(() => this.updateScroll(), 100));
  }

  ngOnDestroy() {
    this.footerService.reset();
  }

  async loadAlbumsList() {

    this.loading = true;

    let albums = (await this.api.get<Album[]>("gallery", { sort: "-dateFrom" })).filter(album => album.dateFrom);

    let year: number;

    this.timeline = albums.map((album, i, filteredAlbums) => {

      let y = i / (filteredAlbums.length - 1);

      let point: TimelineAlbumContainer = {
        y: y,
        title: null,

        _id: album._id,
        name: album.name,
        dateFrom: new Date(album.dateFrom),
        dateTill: new Date(album.dateTill),
        album: null,
      };

      if (point.dateFrom.getFullYear() !== year) {
        year = point.dateFrom.getFullYear();
        this.timelineLabels.push({ y: y, label: String(year) });
      }

      return point;
    });

    this.loading = false;

  }

  updateScroll() {
    if (this.lastRouterScrollEvent.position) this.viewportScroller.scrollToPosition(this.lastRouterScrollEvent.position);
    else this.viewportScroller.scrollToPosition([0, 0]);
  }

  async loadAlbum(point: TimelineAlbumContainer) {

    if (point.album || point.loading) return;

    point.loading = true;

    let album = await this.api.get<Album>(["galleryalbum:preview", point._id]);

    point.album = album;
    point.loading = false;
  }



}
