import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, Scroll } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { DateTime } from "luxon";

import { ApiService } from "app/services/api.service";

import { Album } from "app/shared/schema/album";

import { FooterService } from 'app/services/footer.service';
import { BehaviorSubject } from 'rxjs';

class TimelineAlbumContainer {
  _id: string;
  name: string;
  year: number;
  dateFrom: DateTime;
  dateTill: DateTime;
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

  timeline: TimelineAlbumContainer[] = [];

  loading: boolean = false;

  lastRouterScrollEvent: Scroll;

  search$ = new BehaviorSubject<string>("");
  searchResults: TimelineAlbumContainer[] = [];

  scrollTop$ = new BehaviorSubject<number>(0);

  @ViewChild("content") timelineContent: ElementRef<HTMLDivElement>;

  constructor(
    private api: ApiService,
    private footerService: FooterService,
    router: Router,
    private viewportScroller: ViewportScroller,
    public hostRef: ElementRef
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
    window.addEventListener("scroll", e => {
      window.requestAnimationFrame(() => this.scrollTop$.next(window.scrollY));
    });
  }

  ngOnDestroy() {
    this.footerService.reset();
  }

  async loadAlbumsList() {

    this.loading = true;

    let albums = (await this.api.get<Album[]>("gallery", { sort: "-dateFrom" })).filter(album => album.dateFrom);

    let year: number;

    this.timeline = albums.map(album => {
      const dateFrom = DateTime.fromISO(album.dateFrom);
      const dateTill = DateTime.fromISO(album.dateTill);
      const searchString = [album.name, dateFrom.toFormat("d. L. y"), dateTill.toFormat("d. L. y")].join(" ");
      return {
        _id: album._id,
        name: album.name,
        year: dateFrom.get("year"),
        dateFrom,
        dateTill,
        searchString,
        album: null,
      };
    });

    this.updateSearch();
    this.updateScroll();

    this.loading = false;

  }

  updateScroll() {
    const scrollTop = this.scrollTop$.value;
    const scrollBottom = scrollTop + window.innerHeight;

    this.timeline.forEach((item, i) => {
      const top = i * 320 + 190; // 320 is album height, 190 is height of elements before first album;
      const bottom = top + 320;
      if (bottom >= scrollTop && top <= scrollBottom) {
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
    const searchValue = this.search$.value;
    if (this.search$.value === "") {
      this.searchResults = [];
      return;
    }

    const search_re = searchValue.split(/ /g,).map(string => new RegExp("(^| )" + string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i"));

    this.searchResults = this.timeline.filter(album => search_re.every(re => re.test(album.searchString))).slice(0, 5);

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
