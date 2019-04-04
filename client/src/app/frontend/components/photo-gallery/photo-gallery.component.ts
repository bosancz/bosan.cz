import { Component, Input, Output, EventEmitter, ElementRef, AfterViewChecked, ChangeDetectorRef, SimpleChanges, OnInit, HostListener } from '@angular/core';

export interface GalleryPhoto {
  url:string;
  width:number;
  height:number;
  caption?:string;
  
  adjWidth?:number;
  adjHeight?:number;
  lastInRow?:boolean;
  editCaption?:boolean;
}

@Component({
  selector: 'photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements AfterViewChecked {

  @Input() 
  set photos(photos:GalleryPhoto[]){
    // make a local copy of photos, so we dont change whatever we were given
    this._photos = JSON.parse(JSON.stringify(photos));
    
    this.updateRows();
  }
  
  _photos:GalleryPhoto[] = [];
  
  @Input() height:number = 250;
  @Input() margin:number = 0;
  @Input() editable:boolean = false;
  
  @Output() photoOpen:EventEmitter<any> = new EventEmitter();
  @Output() photoEdit:EventEmitter<any> = new EventEmitter();
  @Output() captionEdit:EventEmitter<any> = new EventEmitter();
  
  width:number;
  
  constructor(private cdRef:ChangeDetectorRef, private el:ElementRef) {
    
  }
  
  ngAfterViewChecked(){
    this.updateWidth();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateWidth();
  }
  
  updateWidth(){
    let width = this.el.nativeElement.offsetWidth;
    if(width !== this.width) {
      this.width = width;
      this.updateRows();
      this.cdRef.detectChanges();
    }
  }

  updateRows(){
    
    let photos = this._photos;
    
    if(!this.width) return;

    let margin = Number(this.margin);
    let height = Number(this.height);
    
    let rowWidth = 0;
    let rowPhotos = [];
    
    photos.forEach(photo => {
      photo.adjHeight = height;
      photo.adjWidth = (height / photo.height) * photo.width;
    });
    
    for (let i = 0; i < photos.length; i++){
      
      let photo = photos[i];
      
      rowPhotos.push(photo);
      rowWidth += photo.adjWidth + margin;     
       
      if(rowWidth > this.width || (photos[i+1] && rowWidth + photos[i+1].adjWidth > this.width)){
        this.adjustRow(rowPhotos);     
        
        rowPhotos = [];
        rowWidth = 0;
      }

    }
    
  }
  
  adjustRow(row:GalleryPhoto[]){
    
    let margin = Number(this.margin);
    let rowWidth = row.reduce((acc,cur) => acc + cur.adjWidth,0) + (row.length - 1) * margin;

    let ratio = (this.width - margin * (row.length - 1) ) / (rowWidth - margin * (row.length - 1));
    row.forEach(rowPhoto => {
      rowPhoto.adjHeight = rowPhoto.adjHeight * ratio;
      rowPhoto.adjWidth = rowPhoto.adjWidth * ratio;
      rowPhoto.lastInRow = false;
    });     

    row[row.length - 1].lastInRow = true;    
  }   

}

                   