import { Component, Input, ElementRef, AfterViewChecked, OnChanges, ChangeDetectorRef, SimpleChanges, OnInit, HostListener } from '@angular/core';

class Row {
  photos:Photo[] = [];
}

class Photo {
  url:string;
  width:number;
  height:number;
  link?:string;
  caption?:string;
}

@Component({
  selector: 'photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements AfterViewChecked, OnChanges {

  @Input() photos:any[];
  
  @Input() height:number = 250;
  @Input() margin:number = 0;
  
  width:number;
  
  rows:Row[] = [];
  
  constructor(private cdRef:ChangeDetectorRef, private el:ElementRef) {
    
  }
  
  ngAfterViewChecked(){
    this.updateWidth();
  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.photos) this.createRows(changes.photos.currentValue);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateWidth();
  }
  
  updateWidth(){
    let width = this.el.nativeElement.offsetWidth;
    if(width !== this.width) {
      this.width = width;
      this.createRows(this.photos);
      this.cdRef.detectChanges();
    }
  }

  createRows(photos:any[]){
    
    if(!this.width) return;

    let margin = Number(this.margin);
    let height = Number(this.height);
    
    let rows = [];
    
    let row:Row = new Row();
    rows.push(row);
    
    let rowWidth = 0;
    
    photos.forEach(photo => {
      
      let rowPhoto:Photo = {
        caption: photo.caption,
        height: height,
        width: height / photo.height * photo.width,
        link: photo.link,
        url: photo.url
      };
      
      if(!row.photos.length || rowWidth + rowPhoto.width <= this.width){
        row.photos.push(rowPhoto);
        rowWidth += rowPhoto.width + margin;
      }
      else{
        rowWidth -= margin;
        
        let ratio = (this.width - margin * (row.photos.length - 1) ) / (rowWidth - margin * (row.photos.length - 1));
        row.photos.forEach(rowPhoto => {
          rowPhoto.height = rowPhoto.height * ratio;
          rowPhoto.width = rowPhoto.width * ratio;
        });
        
        row = new Row();
        rows.push(row);
        rowWidth = 0;
      }
    });
    
    this.rows = rows;
  }

}

                   