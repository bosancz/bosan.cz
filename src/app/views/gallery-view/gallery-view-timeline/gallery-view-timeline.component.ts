import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, Scroll, RouterEvent } from "@angular/router";

import { filter } from "rxjs/operators";

import { DataService } from "app/services/data.service";

import { Paginated } from "app/schema/paginated";
import { Album } from "app/schema/album";

import { TimelinePoint, TimelineLabel } from "app/components/timeline-scroll/timeline-scroll.component";

class TimelineAlbumContainer implements TimelinePoint{
  y:number;
  title:string;    

  _id:string;
  name:string;
  date:Date;
  album:Album;

  loading:boolean = false;
}

@Component({
  selector: 'gallery-view-timeline',
  templateUrl: './gallery-view-timeline.component.html',
  styleUrls: ['./gallery-view-timeline.component.scss']
})
export class GalleryViewTimelineComponent implements OnInit {

  timeline:TimelinePoint[] = [];
  timelineLabels:TimelineLabel[] = [];

  loading:boolean = false;

  lastRouterScrollEvent:Scroll;

  constructor(private dataService:DataService, router:Router, private viewportScroller:ViewportScroller) {
    router.events.pipe(filter<Scroll>(e => e instanceof Scroll)).subscribe(e => this.lastRouterScrollEvent = e);
  }

  ngOnInit() {
    this.loadAlbumsList().then(() => setTimeout(() => this.updateScroll(),100));
  }

  async loadAlbumsList(){

    this.loading = true;
    let options = {
      sort:"-dateFrom",
      filter: { status: "public" }
    };

    let albums = await this.dataService.getAlbumsList(options);

    let year:number;

    this.timeline = albums.filter(album => album.dateFrom).map((album,i,filteredAlbums) => {

      let y = i / (filteredAlbums.length - 1);

      let point = {
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

    let album = await this.dataService.getAlbum(point._id,{titlePhotos:1});

    if(!album.titlePhotos) album.titlePhotos = [];

    if(album.titlePhotos.length < 3){
      album.titlePhotos.push(...await this.dataService.getAlbumPhotos(album._id,{limit: 3 - album.titlePhotos.length}));
    }

    point.album = album;
    point.loading = false;
  }



}
