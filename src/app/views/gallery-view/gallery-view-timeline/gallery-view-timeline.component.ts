import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener,ChangeDetectorRef } from '@angular/core';

import { DataService } from "../../../services/data.service";

import { Paginated } from "../../../schema/paginated";
import { Album } from "../../../schema/album";

class TimelineAlbumContainer{
  _id:string;
  name:string;
  date:Date;
  album?:Album;
  
  visible:boolean = false;
  loading:boolean = false;
}

@Component({
  selector: 'gallery-view-timeline',
  templateUrl: './gallery-view-timeline.component.html',
  styleUrls: ['./gallery-view-timeline.component.scss']
})
export class GalleryViewTimelineComponent implements OnInit {

  @ViewChild('albumsContainer') albumsContainerEl:ElementRef<HTMLElement>; 

  albums:TimelineAlbumContainer[] = [];
  visibleAlbums:TimelineAlbumContainer[] = [];
  
  albumsTop:number;
  albumsLeft:number;
  albumsHeight:number;
  albumsWidth:number;
  
  timelinePoints:Array<number> = [];
  timelineYears:Array<{y:number,year:string}> = [];

  timelineTop:number;
  timelineBottom:number;
  timelineLeft:number;
  
  visibleFrom:number;
  visibleTo:number;
  
  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onDimensionsChange(){
    this.updateDimensions();
    this.updateScroll();
    this.updateVisibleAlbums();
    this.changeDetectorRef.detectChanges();
  }

  constructor(private dataService:DataService, private changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.loadAlbumsList();
  }

  ngAfterViewInit(){
    this.onDimensionsChange();
  }

  async loadAlbumsList(){
    
    let albums = await this.dataService.getAlbumsList({sort:"-dateTaken"})
    
    this.albums = albums.map(album => ({
      _id: album._id,
      name: album.name,
      date: new Date(album.dateTaken),
      album: null,
      visible: false
    }));
    
    this.createTimelinePoints();
    
    // estimate height, DOM is not yet created
    this.albumsHeight = this.albums.length * 300;
    this.updateScroll();
    this.updateVisibleAlbums();
    
    this.updateScroll();
  }

  async loadAlbum(container:TimelineAlbumContainer){
    
    if(container.album || container.loading) return;
    
    container.loading = true;
    
    let album = await this.dataService.getAlbum(container._id,{titlePhotos:1,event:1});
    
    if(!album.titlePhotos) album.titlePhotos = [];
    
    if(album.titlePhotos.length < 3){
      album.titlePhotos.push(...await this.dataService.getAlbumPhotos(album._id,{limit: 3 - album.titlePhotos.length}));
    }
            
    container.album = album;
    container.loading = false;
  }
  
  getScrollTop():number{  
    var doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  }
  
  updateDimensions(){
    this.albumsTop = this.albumsContainerEl.nativeElement.offsetTop;
    this.albumsLeft = this.albumsContainerEl.nativeElement.offsetLeft;
    this.albumsHeight = this.albumsContainerEl.nativeElement.offsetHeight;
    this.albumsWidth = this.albumsContainerEl.nativeElement.offsetWidth;
  }
  
  updateScroll(){
    var top = this.getScrollTop();
    
    this.timelineTop = Math.max(0,this.albumsTop - top);
    this.timelineBottom = Math.max(0,(top + window.innerHeight) - (this.albumsTop + this.albumsHeight));
    this.timelineLeft = this.albumsLeft + this.albumsWidth;
    
    this.visibleFrom = Math.min(1,Math.max(0,(top - this.albumsTop) / this.albumsHeight));
    this.visibleTo = Math.min(1,Math.max(0,(top - this.albumsTop + window.innerHeight) / this.albumsHeight));
  }
  
  updateVisibleAlbums(){
    var count = this.albums.length;
    
    this.visibleAlbums.forEach(album => album.visible = false);
    this.visibleAlbums = this.albums.slice(Math.floor(this.visibleFrom * count),Math.ceil(this.visibleTo * count));
    this.visibleAlbums.forEach(album => {
      album.visible = true
      if(!album.album) setTimeout(() => album.visible ? this.loadAlbum(album) : null,500);
    });
  }
  
  isVisibleAlbum(i:number){
    
  }

  createTimelinePoints(){
    this.timelinePoints = [];
    this.timelineYears = [];

    var year:number = null;

    this.albums.forEach((album,i) => {

      if(album.date.getFullYear() !== year) {
        year = album.date.getFullYear();
        this.timelineYears.push({y:i/(this.albums.length - 1),year:String(year)});
      }
      
      this.timelinePoints.push(i/(this.albums.length - 1));
      
    });
  }
  
  timelineClick(event){
    let top = event.clientY - this.timelineTop;
    let percentage = top/(window.innerHeight - this.timelineBottom - this.timelineTop);
    window.scrollTo({left: 0, top: Math.max(0, this.albumsTop + this.albumsHeight * percentage - window.innerHeight / 2), behavior: "smooth"});
  }

}
