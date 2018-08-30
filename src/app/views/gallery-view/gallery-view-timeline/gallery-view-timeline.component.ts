import { Component, OnInit } from '@angular/core';

import { DataService } from "../../../services/data.service";

import { Paginated } from "../../../schema/paginated";
import { Album } from "../../../schema/album";

import { TimelinePoint, TimelineLabel } from "../../../components/timeline-scroll/timeline-scroll.component";

class TimelineAlbumContainer implements TimelinePoint{
  y:number;
  title: string;    
        
  _id: string;
  name: string;
  date: Date;
  album: Album;
    
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

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadAlbumsList();
  }

  async loadAlbumsList(){
    
    this.loading = true;
    let options = {
      sort:"-dateFrom",
      filter: { status: "public" }
    };
    
    let albums = await this.dataService.getAlbumsList(options)
    
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

  async loadAlbum(point:TimelineAlbumContainer){
    
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
