import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, Scroll, RouterEvent } from "@angular/router";

import { filter } from "rxjs/operators";

import { ApiService } from "app/services/api.service";
import { LayoutService } from "app/services/layout.service";

import { Paginated } from "app/schema/paginated";
import { Album } from "app/schema/album";

import { TimelinePoint, TimelineLabel } from "app/components/timeline-scroll/timeline-scroll.component";

class TimelineAlbumContainer implements TimelinePoint{
  y:number;
  title:string;    

  _id:string;
  name:string;
  dateFrom:Date;
  dateTill:Date;
  album:Album;

  loading?:boolean = false;
}

@Component({
  selector: 'gallery-view-timeline',
  templateUrl: './gallery-view-timeline.component.html',
  styleUrls: ['./gallery-view-timeline.component.scss']
})
export class GalleryViewTimelineComponent implements OnInit, OnDestroy {

  @ViewChild('gallery') container:ElementRef<HTMLElement>;
  
  timeline:TimelineAlbumContainer[] = [];
  timelineLabels:TimelineLabel[] = [];

  loading:boolean = false;

  lastRouterScrollEvent:Scroll;

  constructor(private api:ApiService, private layoutService:LayoutService, router:Router, private viewportScroller:ViewportScroller) {
    router.events.pipe(filter<Scroll>(e => e instanceof Scroll)).subscribe(e => this.lastRouterScrollEvent = e);
    
    layoutService.footer.visible = false;
  }

  ngOnInit() {
    this.loadAlbumsList().then(() => setTimeout(() => this.updateScroll(),100));
  }
  
  ngOnDestroy(){
    this.layoutService.footer.visible = true;
  }

  async loadAlbumsList(){

    this.loading = true;
    let options = {
      sort:"-dateFrom",
      filter: { status: "public" }
    };

    let albums = (await this.api.get<Album[]>("gallery")).filter(album => album.dateFrom);

    albums.sort((a,b) => b.dateFrom.localeCompare(a.dateFrom));

    let year:number;

    this.timeline = albums.map((album,i,filteredAlbums) => {

      let y = i / (filteredAlbums.length - 1);

      let point:TimelineAlbumContainer = {
        y: y,
        title: null,

        _id: album._id,
        name: album.name,
        dateFrom: new Date(album.dateFrom),
        dateTill: new Date(album.dateTill),
        album: null,
      };

      if(point.dateFrom.getFullYear() !== year) {
        year = point.dateFrom.getFullYear();
        this.timelineLabels.push({y:y,label:String(year)});
      }

      return point;
    });

    this.loading = false;

  }

  updateScroll() {    
    if (this.lastRouterScrollEvent.position) this.viewportScroller.scrollToPosition(this.lastRouterScrollEvent.position);
    else this.viewportScroller.scrollToPosition([0, 0]);
  }

  async loadAlbum(point:TimelineAlbumContainer) {

    if(point.album || point.loading) return;

    point.loading = true;

    let album = await this.api.get<Album>(["galleryalbum:preview",point._id]);

    point.album = album;
    point.loading = false;
  }



}
