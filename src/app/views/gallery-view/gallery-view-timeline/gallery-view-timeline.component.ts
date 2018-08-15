import { Component, OnInit } from '@angular/core';

import { DataService } from "../../../services/data.service";

import { Paginated } from "../../../schema/paginated";
import { Album } from "../../../schema/album";

import { TimelinePoint } from "../../../components/timeline-scroll/timeline-scroll.component";

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

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadAlbumsList();
  }

  async loadAlbumsList(){
    
    let albums = await this.dataService.getAlbumsList({sort:"-dateFrom"})
    
    let year:number;
    
    this.timeline = albums.filter(album => album.dateFrom).map((album,i) => {
      
      let point = {
        y: i / (albums.length - 1),
        title: null,
        
        _id: album._id,
        name: album.name,
        date: new Date(album.dateFrom),
        album: null,
      };

      if(point.date.getFullYear() !== year) {
        year = point.date.getFullYear();
        point.title = String(year);
      }
      
      return point;
    });
    
  }

  async loadAlbum(point:TimelineAlbumContainer){
    
    if(point.album || point.loading) return;
    
    point.loading = true;
    
    let album = await this.dataService.getAlbum(point._id,{titlePhotos:1,event:1});
    
    if(!album.titlePhotos) album.titlePhotos = [];
    
    if(album.titlePhotos.length < 3){
      album.titlePhotos.push(...await this.dataService.getAlbumPhotos(album._id,{limit: 3 - album.titlePhotos.length}));
    }
            
    point.album = album;
    point.loading = false;
  }
  


}
