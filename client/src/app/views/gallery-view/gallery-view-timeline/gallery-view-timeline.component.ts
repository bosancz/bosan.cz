import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, Scroll, RouterEvent } from "@angular/router";

import { filter, debounceTime } from "rxjs/operators";

import { ApiService } from "app/services/api.service";

import { Paginated } from "app/shared/schema/paginated";
import { Album } from "app/shared/schema/album";

import { TimelinePoint, TimelineLabel } from "app/shared/components/timeline-scroll/timeline-scroll.component";
import { FooterService } from 'app/services/footer.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { ScrollToEvent } from '@nicky-lenaers/ngx-scroll-to/lib/scroll-to-event.interface';

class TimelineAlbumContainer implements TimelinePoint {
  y: number;
  title: string;

  _id: string;
  name: string;
  dateFrom: Date;
  dateTill: Date;
  searchString: string;

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

  search$ = new BehaviorSubject<string>("");
  searchResults: TimelineAlbumContainer[] = [];

  scrollTop$ = new BehaviorSubject<number>(0);

  @ViewChild("timelineContent") timelineContent: ElementRef<HTMLDivElement>;

  constructor(
    private api: ApiService,
    private footerService: FooterService,
    router: Router,
    private viewportScroller: ViewportScroller
  ) {

    // router.events.pipe(filter<Scroll>(e => e instanceof Scroll)).subscribe(e => this.lastRouterScrollEvent = e);

    this.search$.pipe(debounceTime(250)).subscribe(search => this.updateSearch());

    this.scrollTop$.pipe(debounceTime(250)).subscribe(scrollTop => this.updateScroll());

    footerService.hide();
  }

  ngOnInit() {
    // this.loadAlbumsList().then(() => setTimeout(() => this.updateScroll(), 100));
    this.loadAlbumsList()
  }

  ngAfterViewInit() {
    this.timelineContent.nativeElement.addEventListener("scroll", e => this.scrollTop$.next((<HTMLDivElement>e.target).scrollTop));
  }

  ngOnDestroy() {
    this.footerService.reset();
  }

  async loadAlbumsList() {

    this.loading = true;

    let albums = (await this.api.get<Album[]>("gallery", { sort: "-dateFrom" })).filter(album => album.dateFrom);

    let year: number;

    this.timeline = albums.map((album, i, filteredAlbums) => ({
      _id: album._id,
      name: album.name,
      dateFrom: new Date(album.dateFrom),
      dateTill: new Date(album.dateTill),
      searchString: album.name,
      album: null,
    }) as TimelineAlbumContainer);

    this.updateSearch();
    this.updateScroll();

    this.loading = false;

  }

  updateScroll() {
    const scrollTop = this.scrollTop$.value;
    const scrollBottom = scrollTop + window.innerHeight;

    this.timeline.forEach((item, i) => {
      const top = i * 320;
      if (top + 320 >= scrollTop && top <= scrollBottom) {
        this.loadAlbum(item);
      }
      else {
        this.unloadAlbum(item);
      }
    })
  }

  restoreScrollAfterRouting() {
    if (this.lastRouterScrollEvent.position) this.viewportScroller.scrollToPosition(this.lastRouterScrollEvent.position);
    else this.viewportScroller.scrollToPosition([0, 0]);
  }

  updateSearch() {
    if (this.search$.value === "") {
      this.searchResults = [];
      return;
    }
    const search_re = new RegExp("(^| )" + this.search$.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    this.searchResults = this.timeline.filter(album => search_re.test(album.searchString)).slice(0, 5);
  }


  async loadAlbum(point: TimelineAlbumContainer) {

    if (point.album || point.loading) return;

    point.loading = true;

    let album = await this.api.get<Album>(["galleryalbum:preview", point._id]);

    point.album = album;
    point.loading = false;
  }

  async unloadAlbum(point: TimelineAlbumContainer) {

  }



}
